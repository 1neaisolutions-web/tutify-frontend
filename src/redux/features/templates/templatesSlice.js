// Library Imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Local Imports
import axiosInstance from '../../http';
import { logoutUser } from '../auth/authSlice';

// Helper function to handle API errors consistently
const handleApiError = (error) => {
  const message =
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    'An unexpected error occurred';
  return message;
};

// Initial state
const initialState = {
  templates: [],
  templatesMap: {}, // For quick lookup by ID
  favorites: [], // Array of template IDs that are favorited
  loading: false,
  error: null,
  total: 0,
  filters: {},
  templateDetail: null,
  detailLoading: false,
  detailError: null,
};

// Transform backend template to frontend format
const transformTemplate = (t) => {
  return {
    id: String(t.id || ''),
    slug: t.slug || '',
    title: t.name || '',
    description: t.description || null,
    subject: t.subject_default || '',
    gradeBand: Array.isArray(t.grade_bands_supported) && t.grade_bands_supported.length > 0
      ? t.grade_bands_supported[0]
      : '',
    bloom: null,
    kind: null,
    inputSchema: null,
    canonicalOutcome: null,
    standards: [],
    is_hot: t.is_hot || false,
    is_favorite: t.is_favorite || false,
    execution_count: t.execution_count || 0,
    category: t.category || null,
  };
};

// Fetch templates list
export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (params, { getState, rejectWithValue }) => {
    try {
      // Build query params - do not send page/page_size so backend returns full list
      const queryParams = {};
      if (params?.subject) queryParams.subject = params.subject;
      if (params?.gradeBand) queryParams.grade_band = params.gradeBand;
      if (params?.q) queryParams.q = params.q;
      if (params?.is_hot !== undefined) queryParams.is_hot = params.is_hot;
      if (params?.is_favorite !== undefined) queryParams.is_favorite = params.is_favorite;
      if (params?.sort) queryParams.sort = params.sort;

      // Auth token automatically included by axiosInstance interceptor
      // Log for debugging
      const state = getState();
      const token = state?.auth?.user?.token;
      const userId = state?.auth?.user?.id;
      console.log('[templatesSlice] Fetching templates', {
        hasToken: !!token,
        userId: userId,
        filters: queryParams,
      });

      const response = await axiosInstance.get('/api/v1/templates', {
        params: queryParams,
      });
      
      // Handle both array response and paginated response
      const templatesArray = Array.isArray(response.data) 
        ? response.data 
        : (response.data.items || []);
      
      console.log('[templatesSlice] Templates fetched', {
        count: templatesArray.length,
        favoritesCount: templatesArray.filter(t => t.is_favorite).length,
      });

      // Transform templates to frontend format
      const transformedTemplates = templatesArray.map(transformTemplate);

      return {
        items: transformedTemplates,
        total: response.data.total || transformedTemplates.length,
        page: response.data.page || 1,
        pageSize: response.data.pageSize || transformedTemplates.length,
      };
    } catch (error) {
      console.error('[templatesSlice] Error fetching templates:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch single template detail
export const fetchTemplateDetail = createAsyncThunk(
  'templates/fetchTemplateDetail',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/v1/templates/${slug}`);
      return transformTemplate(response.data);
    } catch (error) {
      console.error('[templatesSlice] Error fetching template detail:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Toggle template favorite (requires authentication)
export const toggleTemplateFavorite = createAsyncThunk(
  'templates/toggleFavorite',
  async (templateId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.auth.user?.token;

      // Check if user is authenticated
      if (!token) {
        return rejectWithValue({
          message: 'Please log in to add favorites',
          code: 'AUTH_REQUIRED',
        });
      }

      // Auth token automatically included by axiosInstance interceptor
      const response = await axiosInstance.post(
        `/api/v1/templates/${templateId}/favorite/toggle`
      );

      return {
        templateId: String(templateId),
        is_favorite: response.data.is_favorite,
        message: response.data.message,
      };
    } catch (error) {
      console.error('[templatesSlice] Error toggling favorite:', error);

      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        return rejectWithValue({
          message: 'Please log in to add favorites',
          code: 'AUTH_REQUIRED',
        });
      }

      return rejectWithValue({
        message: handleApiError(error),
        code: 'API_ERROR',
      });
    }
  }
);

// Fetch frameworks
export const fetchFrameworks = createAsyncThunk(
  'templates/fetchFrameworks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/v1/standards/frameworks');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('[templatesSlice] Error fetching frameworks:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Templates slice
const templatesSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.detailError = null;
    },
    clearDetail: (state) => {
      state.templateDetail = null;
      state.detailError = null;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearTemplates: (state) => {
      // Clear templates when user logs out to prevent showing wrong favorites
      state.templates = [];
      state.templatesMap = {};
      state.favorites = [];
      state.total = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch templates
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.templates = action.payload.items || [];
        state.total = action.payload.total || 0;

        // Build templatesMap for quick lookup
        const map = {};
        state.templates.forEach((template) => {
          map[template.id] = template;
        });
        state.templatesMap = map;

        // Extract favorites list
        state.favorites = state.templates
          .filter((t) => t.is_favorite)
          .map((t) => t.id);
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.templates = [];
        state.total = 0;
      })
      // Fetch template detail
      .addCase(fetchTemplateDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchTemplateDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detailError = null;
        state.templateDetail = action.payload;

        // Update in templatesMap if exists
        if (state.templatesMap[action.payload.id]) {
          state.templatesMap[action.payload.id] = action.payload;
        }
      })
      .addCase(fetchTemplateDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })
      // Toggle favorite
      .addCase(toggleTemplateFavorite.pending, (state) => {
        // No loading state for favorites - optimistic update
      })
      .addCase(toggleTemplateFavorite.fulfilled, (state, action) => {
        const { templateId, is_favorite } = action.payload;

        // Update favorites array
        if (is_favorite) {
          if (!state.favorites.includes(templateId)) {
            state.favorites.push(templateId);
          }
        } else {
          state.favorites = state.favorites.filter((id) => id !== templateId);
        }

        // Update template in templates list
        const template = state.templates.find((t) => t.id === templateId);
        if (template) {
          template.is_favorite = is_favorite;
        }

        // Update template in templatesMap
        if (state.templatesMap[templateId]) {
          state.templatesMap[templateId].is_favorite = is_favorite;
        }

        // Update detail if it's the same template
        if (state.templateDetail?.id === templateId) {
          state.templateDetail.is_favorite = is_favorite;
        }
      })
      .addCase(toggleTemplateFavorite.rejected, (state, action) => {
        // Error is handled in component, but we can log it
        console.error('[templatesSlice] Toggle favorite rejected:', action.payload);
      })
      // Fetch frameworks
      .addCase(fetchFrameworks.fulfilled, (state, action) => {
        // Frameworks can be stored if needed, or just returned to component
      })
      // Clear templates when user logs out
      .addCase(logoutUser, (state) => {
        state.templates = [];
        state.templatesMap = {};
        state.favorites = [];
        state.total = 0;
        state.error = null;
        state.templateDetail = null;
        state.detailError = null;
      });
  },
});

export const { clearError, clearDetail, updateFilters, clearFilters, clearTemplates } = templatesSlice.actions;
export default templatesSlice.reducer;
