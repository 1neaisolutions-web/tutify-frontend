/**
 * Professional Identity section for Profile page.
 * Experience, Education, Certifications, Achievements, Career Documents.
 */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from '../hooks/useSnackbar';
import {
  CustomInput,
  CustomButton,
  SelectDropdown,
  Textarea,
  CustomModal,
} from '../components/shared';
import {
  createExperience,
  updateExperience,
  deleteExperience,
  createEducation,
  updateEducation,
  deleteEducation,
  createCertification,
  updateCertification,
  deleteCertification,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  uploadCareerDocument,
  deleteCareerDocument,
  clearTeacherIdentityError,
} from '../redux/features/teacherIdentity/teacherIdentitySlice';
import { fetchLearningHubHome } from '../redux/features/learningHub/learningHubSlice';
import { Briefcase, GraduationCap, Award, Trophy, FileText, Plus, Pencil, Trash2 } from 'lucide-react';

const EMPLOYMENT_TYPES = [
  { value: 'full_time', label: 'Full time' },
  { value: 'part_time', label: 'Part time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'volunteer', label: 'Volunteer' },
];

const DOCUMENT_TYPES = [
  { value: 'resume', label: 'Resume' },
  { value: 'cv', label: 'CV' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'certification', label: 'Certification' },
  { value: 'research', label: 'Research' },
  { value: 'other', label: 'Other' },
];

const toDateStr = (d) => {
  if (!d) return '';
  if (typeof d === 'string') return d.slice(0, 10);
  return d;
};

export default function ProfileProfessionalIdentitySection() {
  const dispatch = useDispatch();
  const { toast } = useSnackbar();
  const {
    experience,
    education,
    certifications,
    achievements,
    documents,
    loading,
    saving,
    deleting,
    uploading,
    error: identityError,
  } = useSelector((state) => state.teacherIdentity) ?? {};

  const [error, setError] = useState(null);
  useEffect(() => {
    setError(identityError);
  }, [identityError]);

  // Inline form visibility and editing id per section
  const [showExpForm, setShowExpForm] = useState(false);
  const [editingExpId, setEditingExpId] = useState(null);
  const [showEduForm, setShowEduForm] = useState(false);
  const [editingEduId, setEditingEduId] = useState(null);
  const [showCertForm, setShowCertForm] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [showAchForm, setShowAchForm] = useState(false);
  const [editingAchId, setEditingAchId] = useState(null);
  const [showDocUpload, setShowDocUpload] = useState(false);

  // Delete confirm modal
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', id: null, label: '' });

  // Form state objects (field names match backend)
  const [expForm, setExpForm] = useState({
    institution_name: '',
    role_title: '',
    subject_area: '',
    grade_band: '',
    employment_type: 'full_time',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    location_city: '',
    location_country: '',
  });
  const [eduForm, setEduForm] = useState({
    institution_name: '',
    degree: '',
    field_of_study: '',
    start_year: '',
    end_year: '',
    is_completed: true,
    description: '',
  });
  const [certForm, setCertForm] = useState({
    name: '',
    issuer: '',
    license_number: '',
    issue_date: '',
    expiry_date: '',
    credential_url: '',
  });
  const [achForm, setAchForm] = useState({
    title: '',
    organization: '',
    date: '',
    description: '',
  });
  const [docUpload, setDocUpload] = useState({ file: null, document_type: 'resume', title: '' });

  const resetExpForm = () => {
    setExpForm({
      institution_name: '',
      role_title: '',
      subject_area: '',
      grade_band: '',
      employment_type: 'full_time',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      location_city: '',
      location_country: '',
    });
    setEditingExpId(null);
    setShowExpForm(false);
  };
  const resetEduForm = () => {
    setEduForm({
      institution_name: '',
      degree: '',
      field_of_study: '',
      start_year: '',
      end_year: '',
      is_completed: true,
      description: '',
    });
    setEditingEduId(null);
    setShowEduForm(false);
  };
  const resetCertForm = () => {
    setCertForm({
      name: '',
      issuer: '',
      license_number: '',
      issue_date: '',
      expiry_date: '',
      credential_url: '',
    });
    setEditingCertId(null);
    setShowCertForm(false);
  };
  const resetAchForm = () => {
    setAchForm({ title: '', organization: '', date: '', description: '' });
    setEditingAchId(null);
    setShowAchForm(false);
  };

  const handleExpSubmit = async () => {
    if (!expForm.institution_name?.trim() || !expForm.role_title?.trim() || !expForm.employment_type || !expForm.start_date) {
      toast.error('Institution, role, employment type, and start date are required.');
      return;
    }
    const payload = {
      institution_name: expForm.institution_name.trim(),
      role_title: expForm.role_title.trim(),
      employment_type: expForm.employment_type,
      start_date: expForm.start_date,
      end_date: expForm.end_date || null,
      is_current: !!expForm.is_current,
      subject_area: expForm.subject_area?.trim() || null,
      grade_band: expForm.grade_band?.trim() || null,
      description: expForm.description?.trim() || null,
      location_city: expForm.location_city?.trim() || null,
      location_country: expForm.location_country?.trim() || null,
    };
    if (editingExpId) {
      const result = await dispatch(updateExperience({ id: editingExpId, data: payload }));
      if (updateExperience.fulfilled.match(result)) {
        dispatch(fetchLearningHubHome());
        toast.success('Experience updated.');
        resetExpForm();
      }
    } else {
      const result = await dispatch(createExperience(payload));
      if (createExperience.fulfilled.match(result)) {
        dispatch(fetchLearningHubHome());
        toast.success('Experience added.');
        resetExpForm();
      }
    }
  };

  const handleEduSubmit = async () => {
    if (!eduForm.institution_name?.trim() || !eduForm.degree?.trim() || !eduForm.field_of_study?.trim()) {
      toast.error('Institution, degree, and field of study are required.');
      return;
    }
    const payload = {
      institution_name: eduForm.institution_name.trim(),
      degree: eduForm.degree.trim(),
      field_of_study: eduForm.field_of_study.trim(),
      is_completed: !!eduForm.is_completed,
      start_year: eduForm.start_year ? parseInt(eduForm.start_year, 10) : null,
      end_year: eduForm.end_year ? parseInt(eduForm.end_year, 10) : null,
      description: eduForm.description?.trim() || null,
    };
    if (editingEduId) {
      const result = await dispatch(updateEducation({ id: editingEduId, data: payload }));
      if (updateEducation.fulfilled.match(result)) {
        dispatch(fetchLearningHubHome());
        toast.success('Education updated.');
        resetEduForm();
      }
    } else {
      const result = await dispatch(createEducation(payload));
      if (createEducation.fulfilled.match(result)) {
        dispatch(fetchLearningHubHome());
        toast.success('Education added.');
        resetEduForm();
      }
    }
  };

  const handleCertSubmit = async () => {
    if (!certForm.name?.trim() || !certForm.issuer?.trim()) {
      toast.error('Name and issuer are required.');
      return;
    }
    const payload = {
      name: certForm.name.trim(),
      issuer: certForm.issuer.trim(),
      license_number: certForm.license_number?.trim() || null,
      issue_date: certForm.issue_date || null,
      expiry_date: certForm.expiry_date || null,
      credential_url: certForm.credential_url?.trim() || null,
    };
    if (editingCertId) {
      const result = await dispatch(updateCertification({ id: editingCertId, data: payload }));
      if (updateCertification.fulfilled.match(result)) {
        dispatch(fetchLearningHubHome());
        toast.success('Certification updated.');
        resetCertForm();
      }
    } else {
      const result = await dispatch(createCertification(payload));
      if (createCertification.fulfilled.match(result)) {
        dispatch(fetchLearningHubHome());
        toast.success('Certification added.');
        resetCertForm();
      }
    }
  };

  const handleAchSubmit = async () => {
    if (!achForm.title?.trim()) {
      toast.error('Title is required.');
      return;
    }
    const payload = {
      title: achForm.title.trim(),
      organization: achForm.organization?.trim() || null,
      date: achForm.date || null,
      description: achForm.description?.trim() || null,
    };
    if (editingAchId) {
      const result = await dispatch(updateAchievement({ id: editingAchId, data: payload }));
      if (updateAchievement.fulfilled.match(result)) {
        dispatch(fetchLearningHubHome());
        toast.success('Achievement updated.');
        resetAchForm();
      }
    } else {
      const result = await dispatch(createAchievement(payload));
      if (createAchievement.fulfilled.match(result)) {
        dispatch(fetchLearningHubHome());
        toast.success('Achievement added.');
        resetAchForm();
      }
    }
  };

  const handleDocUpload = async () => {
    if (!docUpload.file) {
      toast.error('Please select a file.');
      return;
    }
    const result = await dispatch(
      uploadCareerDocument({
        file: docUpload.file,
        document_type: docUpload.document_type,
        title: docUpload.title?.trim() || undefined,
      })
    );
    if (uploadCareerDocument.fulfilled.match(result)) {
      dispatch(fetchLearningHubHome());
      toast.success('Document uploaded.');
      setDocUpload({ file: null, document_type: 'resume', title: '' });
      setShowDocUpload(false);
    }
  };

  const handleDelete = async () => {
    const { type, id } = deleteModal;
    if (!id) return;
    let thunk;
    switch (type) {
      case 'experience':
        thunk = deleteExperience(id);
        break;
      case 'education':
        thunk = deleteEducation(id);
        break;
      case 'certification':
        thunk = deleteCertification(id);
        break;
      case 'achievement':
        thunk = deleteAchievement(id);
        break;
      case 'document':
        thunk = deleteCareerDocument(id);
        break;
      default:
        return;
    }
    const result = await dispatch(thunk);
    if (result.meta?.requestStatus === 'fulfilled') {
      dispatch(fetchLearningHubHome());
      toast.success('Deleted.');
    }
    setDeleteModal({ open: false, type: '', id: null, label: '' });
  };

  const openEditExp = (item) => {
    setExpForm({
      institution_name: item.institution_name || '',
      role_title: item.role_title || '',
      subject_area: item.subject_area || '',
      grade_band: item.grade_band || '',
      employment_type: item.employment_type || 'full_time',
      start_date: toDateStr(item.start_date),
      end_date: toDateStr(item.end_date),
      is_current: !!item.is_current,
      description: item.description || '',
      location_city: item.location_city || '',
      location_country: item.location_country || '',
    });
    setEditingExpId(item.id);
    setShowExpForm(true);
  };
  const openEditEdu = (item) => {
    setEduForm({
      institution_name: item.institution_name || '',
      degree: item.degree || '',
      field_of_study: item.field_of_study || '',
      start_year: item.start_year ?? '',
      end_year: item.end_year ?? '',
      is_completed: !!item.is_completed,
      description: item.description || '',
    });
    setEditingEduId(item.id);
    setShowEduForm(true);
  };
  const openEditCert = (item) => {
    setCertForm({
      name: item.name || '',
      issuer: item.issuer || '',
      license_number: item.license_number || '',
      issue_date: toDateStr(item.issue_date),
      expiry_date: toDateStr(item.expiry_date),
      credential_url: item.credential_url || '',
    });
    setEditingCertId(item.id);
    setShowCertForm(true);
  };
  const openEditAch = (item) => {
    setAchForm({
      title: item.title || '',
      organization: item.organization || '',
      date: toDateStr(item.date),
      description: item.description || '',
    });
    setEditingAchId(item.id);
    setShowAchForm(true);
  };

  const busy = saving || deleting || uploading;
  const listClass = 'space-y-2';
  const itemClass = 'flex items-start justify-between gap-2 p-3 bg-white border border-gray-200 rounded-lg';
  const btnIconClass = 'w-4 h-4';

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <Briefcase className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">Professional Identity</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Your professional profile improves AI personalization and growth recommendations.
      </p>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex justify-between items-center">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => { dispatch(clearTeacherIdentityError()); setError(null); }}
            className="text-red-700 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Experience */}
      <div className="mb-8">
        <h3 className="text-base font-medium text-gray-800 mb-2 flex items-center gap-2">
          <Briefcase className="w-4 h-4" /> Experience
        </h3>
        <ul className={listClass}>
          {(experience ?? []).map((item) => (
            <li key={item.id} className={itemClass}>
              <div className="min-w-0">
                <span className="font-medium text-gray-900">{item.role_title}</span>
                {item.institution_name && <span className="text-gray-600"> at {item.institution_name}</span>}
                {(item.start_date || item.end_date) && (
                  <span className="text-gray-500 text-sm block mt-0.5">
                    {toDateStr(item.start_date)} – {item.is_current ? 'Present' : toDateStr(item.end_date) || '—'}
                  </span>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button type="button" onClick={() => openEditExp(item)} disabled={busy} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded">
                  <Pencil className={btnIconClass} />
                </button>
                <button type="button" onClick={() => setDeleteModal({ open: true, type: 'experience', id: item.id, label: item.role_title })} disabled={busy} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                  <Trash2 className={btnIconClass} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        {!showExpForm && (
          <CustomButton type="button" onClick={() => { setEditingExpId(null); setExpForm({ institution_name: '', role_title: '', subject_area: '', grade_band: '', employment_type: 'full_time', start_date: '', end_date: '', is_current: false, description: '', location_city: '', location_country: '' }); setShowExpForm(true); }} disabled={busy} variant="outlined" className="!border-gray-300 !text-gray-700 mt-2">
            <Plus className="w-4 h-4 mr-1 inline" /> Add experience
          </CustomButton>
        )}
        {showExpForm && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-800">{editingExpId ? 'Edit experience' : 'New experience'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput label="Institution" name="institution_name" value={expForm.institution_name} onChange={(e) => setExpForm((p) => ({ ...p, institution_name: e.target.value }))} placeholder="School or organization" required disabled={busy} />
              <CustomInput label="Role / Title" name="role_title" value={expForm.role_title} onChange={(e) => setExpForm((p) => ({ ...p, role_title: e.target.value }))} placeholder="e.g. Math Teacher" required disabled={busy} />
              <SelectDropdown label="Employment type" name="employment_type" value={expForm.employment_type} onChange={(e) => { const v = e.target?.value; setExpForm((p) => ({ ...p, employment_type: (v && typeof v === 'object' && 'value' in v ? v.value : v) || p.employment_type })); }} options={EMPLOYMENT_TYPES} disabled={busy} required />
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start date</label>
                <input type="date" value={expForm.start_date} onChange={(e) => setExpForm((p) => ({ ...p, start_date: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" disabled={busy} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End date (leave empty if current)</label>
                <input type="date" value={expForm.end_date} onChange={(e) => setExpForm((p) => ({ ...p, end_date: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" disabled={busy} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="exp-current" checked={expForm.is_current} onChange={(e) => setExpForm((p) => ({ ...p, is_current: e.target.checked }))} disabled={busy} />
                <label htmlFor="exp-current" className="text-sm text-gray-700">Currently working here</label>
              </div>
              <CustomInput label="Subject area" name="subject_area" value={expForm.subject_area} onChange={(e) => setExpForm((p) => ({ ...p, subject_area: e.target.value }))} disabled={busy} />
              <CustomInput label="Grade band" name="grade_band" value={expForm.grade_band} onChange={(e) => setExpForm((p) => ({ ...p, grade_band: e.target.value }))} disabled={busy} />
              <CustomInput label="City" name="location_city" value={expForm.location_city} onChange={(e) => setExpForm((p) => ({ ...p, location_city: e.target.value }))} disabled={busy} />
              <CustomInput label="Country" name="location_country" value={expForm.location_country} onChange={(e) => setExpForm((p) => ({ ...p, location_country: e.target.value }))} disabled={busy} />
            </div>
            <Textarea label="Description" name="description" value={expForm.description} onChange={(e) => setExpForm((p) => ({ ...p, description: e.target.value }))} rows={2} disabled={busy} />
            <div className="flex gap-2">
              <CustomButton type="button" onClick={handleExpSubmit} disabled={busy} loading={saving}>Save</CustomButton>
              <CustomButton type="button" variant="outlined" onClick={resetExpForm} disabled={busy}>Cancel</CustomButton>
            </div>
          </div>
        )}
      </div>

      {/* Education */}
      <div className="mb-8">
        <h3 className="text-base font-medium text-gray-800 mb-2 flex items-center gap-2">
          <GraduationCap className="w-4 h-4" /> Education
        </h3>
        <ul className={listClass}>
          {(education ?? []).map((item) => (
            <li key={item.id} className={itemClass}>
              <div>
                <span className="font-medium text-gray-900">{item.degree}</span>
                {item.field_of_study && <span className="text-gray-600"> in {item.field_of_study}</span>}
                {item.institution_name && <span className="text-gray-600"> – {item.institution_name}</span>}
                {(item.start_year || item.end_year) && (
                  <span className="text-gray-500 text-sm block">{(item.start_year || item.end_year) && `${item.start_year ?? '—'} – ${item.end_year ?? '—'}`}</span>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button type="button" onClick={() => openEditEdu(item)} disabled={busy} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"><Pencil className={btnIconClass} /></button>
                <button type="button" onClick={() => setDeleteModal({ open: true, type: 'education', id: item.id, label: item.degree })} disabled={busy} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className={btnIconClass} /></button>
              </div>
            </li>
          ))}
        </ul>
        {!showEduForm && (
          <CustomButton type="button" onClick={() => { setShowEduForm(true); setEditingEduId(null); setEduForm({ institution_name: '', degree: '', field_of_study: '', start_year: '', end_year: '', is_completed: true, description: '' }); }} disabled={busy} variant="outlined" className="!border-gray-300 !text-gray-700 mt-2">
            <Plus className="w-4 h-4 mr-1 inline" /> Add education
          </CustomButton>
        )}
        {showEduForm && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-800">{editingEduId ? 'Edit education' : 'New education'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput label="Institution" name="institution_name" value={eduForm.institution_name} onChange={(e) => setEduForm((p) => ({ ...p, institution_name: e.target.value }))} required disabled={busy} />
              <CustomInput label="Degree" name="degree" value={eduForm.degree} onChange={(e) => setEduForm((p) => ({ ...p, degree: e.target.value }))} placeholder="e.g. B.Ed." required disabled={busy} />
              <CustomInput label="Field of study" name="field_of_study" value={eduForm.field_of_study} onChange={(e) => setEduForm((p) => ({ ...p, field_of_study: e.target.value }))} required disabled={busy} />
              <CustomInput label="Start year" name="start_year" type="number" value={eduForm.start_year} onChange={(e) => setEduForm((p) => ({ ...p, start_year: e.target.value }))} placeholder="e.g. 2010" disabled={busy} />
              <CustomInput label="End year" name="end_year" type="number" value={eduForm.end_year} onChange={(e) => setEduForm((p) => ({ ...p, end_year: e.target.value }))} placeholder="e.g. 2014" disabled={busy} />
              <div className="flex items-center gap-2">
                <input type="checkbox" id="edu-completed" checked={eduForm.is_completed} onChange={(e) => setEduForm((p) => ({ ...p, is_completed: e.target.checked }))} disabled={busy} />
                <label htmlFor="edu-completed" className="text-sm text-gray-700">Completed</label>
              </div>
            </div>
            <Textarea label="Description" name="description" value={eduForm.description} onChange={(e) => setEduForm((p) => ({ ...p, description: e.target.value }))} rows={2} disabled={busy} />
            <div className="flex gap-2">
              <CustomButton type="button" onClick={handleEduSubmit} disabled={busy} loading={saving}>Save</CustomButton>
              <CustomButton type="button" variant="outlined" onClick={resetEduForm} disabled={busy}>Cancel</CustomButton>
            </div>
          </div>
        )}
      </div>

      {/* Certifications */}
      <div className="mb-8">
        <h3 className="text-base font-medium text-gray-800 mb-2 flex items-center gap-2">
          <Award className="w-4 h-4" /> Certifications
        </h3>
        <ul className={listClass}>
          {(certifications ?? []).map((item) => (
            <li key={item.id} className={itemClass}>
              <div>
                <span className="font-medium text-gray-900">{item.name}</span>
                {item.issuer && <span className="text-gray-600"> – {item.issuer}</span>}
                {(item.issue_date || item.expiry_date) && (
                  <span className="text-gray-500 text-sm block">{toDateStr(item.issue_date)} – {toDateStr(item.expiry_date) || '—'}</span>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button type="button" onClick={() => openEditCert(item)} disabled={busy} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"><Pencil className={btnIconClass} /></button>
                <button type="button" onClick={() => setDeleteModal({ open: true, type: 'certification', id: item.id, label: item.name })} disabled={busy} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className={btnIconClass} /></button>
              </div>
            </li>
          ))}
        </ul>
        {!showCertForm && (
          <CustomButton type="button" onClick={() => { setShowCertForm(true); setEditingCertId(null); setCertForm({ name: '', issuer: '', license_number: '', issue_date: '', expiry_date: '', credential_url: '' }); }} disabled={busy} variant="outlined" className="!border-gray-300 !text-gray-700 mt-2">
            <Plus className="w-4 h-4 mr-1 inline" /> Add certification
          </CustomButton>
        )}
        {showCertForm && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-800">{editingCertId ? 'Edit certification' : 'New certification'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput label="Name" name="name" value={certForm.name} onChange={(e) => setCertForm((p) => ({ ...p, name: e.target.value }))} required disabled={busy} />
              <CustomInput label="Issuer" name="issuer" value={certForm.issuer} onChange={(e) => setCertForm((p) => ({ ...p, issuer: e.target.value }))} required disabled={busy} />
              <CustomInput label="License number" name="license_number" value={certForm.license_number} onChange={(e) => setCertForm((p) => ({ ...p, license_number: e.target.value }))} disabled={busy} />
              <div><label className="block text-xs text-gray-500 mb-1">Issue date</label><input type="date" value={certForm.issue_date} onChange={(e) => setCertForm((p) => ({ ...p, issue_date: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" disabled={busy} /></div>
              <div><label className="block text-xs text-gray-500 mb-1">Expiry date</label><input type="date" value={certForm.expiry_date} onChange={(e) => setCertForm((p) => ({ ...p, expiry_date: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" disabled={busy} /></div>
              <CustomInput label="Credential URL" name="credential_url" value={certForm.credential_url} onChange={(e) => setCertForm((p) => ({ ...p, credential_url: e.target.value }))} disabled={busy} className="md:col-span-2" />
            </div>
            <div className="flex gap-2">
              <CustomButton type="button" onClick={handleCertSubmit} disabled={busy} loading={saving}>Save</CustomButton>
              <CustomButton type="button" variant="outlined" onClick={resetCertForm} disabled={busy}>Cancel</CustomButton>
            </div>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="mb-8">
        <h3 className="text-base font-medium text-gray-800 mb-2 flex items-center gap-2">
          <Trophy className="w-4 h-4" /> Achievements
        </h3>
        <ul className={listClass}>
          {(achievements ?? []).map((item) => (
            <li key={item.id} className={itemClass}>
              <div>
                <span className="font-medium text-gray-900">{item.title}</span>
                {item.organization && <span className="text-gray-600"> – {item.organization}</span>}
                {item.date && <span className="text-gray-500 text-sm block">{toDateStr(item.date)}</span>}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button type="button" onClick={() => openEditAch(item)} disabled={busy} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"><Pencil className={btnIconClass} /></button>
                <button type="button" onClick={() => setDeleteModal({ open: true, type: 'achievement', id: item.id, label: item.title })} disabled={busy} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 className={btnIconClass} /></button>
              </div>
            </li>
          ))}
        </ul>
        {!showAchForm && (
          <CustomButton type="button" onClick={() => { setShowAchForm(true); setEditingAchId(null); setAchForm({ title: '', organization: '', date: '', description: '' }); }} disabled={busy} variant="outlined" className="!border-gray-300 !text-gray-700 mt-2">
            <Plus className="w-4 h-4 mr-1 inline" /> Add achievement
          </CustomButton>
        )}
        {showAchForm && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-800">{editingAchId ? 'Edit achievement' : 'New achievement'}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput label="Title" name="title" value={achForm.title} onChange={(e) => setAchForm((p) => ({ ...p, title: e.target.value }))} required disabled={busy} className="md:col-span-2" />
              <CustomInput label="Organization" name="organization" value={achForm.organization} onChange={(e) => setAchForm((p) => ({ ...p, organization: e.target.value }))} disabled={busy} />
              <div><label className="block text-xs text-gray-500 mb-1">Date</label><input type="date" value={achForm.date} onChange={(e) => setAchForm((p) => ({ ...p, date: e.target.value }))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm" disabled={busy} /></div>
            </div>
            <Textarea label="Description" name="description" value={achForm.description} onChange={(e) => setAchForm((p) => ({ ...p, description: e.target.value }))} rows={2} disabled={busy} />
            <div className="flex gap-2">
              <CustomButton type="button" onClick={handleAchSubmit} disabled={busy} loading={saving}>Save</CustomButton>
              <CustomButton type="button" variant="outlined" onClick={resetAchForm} disabled={busy}>Cancel</CustomButton>
            </div>
          </div>
        )}
      </div>

      {/* Career Documents */}
      <div>
        <h3 className="text-base font-medium text-gray-800 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Career documents
        </h3>
        <ul className={listClass}>
          {(documents ?? []).map((item) => (
            <li key={item.id} className={itemClass}>
              <div>
                <span className="font-medium text-gray-900">{item.title || item.file_name}</span>
                <span className="text-gray-500 text-sm block">{item.document_type} · {item.file_name} ({(item.file_size / 1024).toFixed(1)} KB)</span>
              </div>
              <button type="button" onClick={() => setDeleteModal({ open: true, type: 'document', id: item.id, label: item.file_name })} disabled={busy} className="p-1.5 text-red-600 hover:bg-red-50 rounded flex-shrink-0">
                <Trash2 className={btnIconClass} />
              </button>
            </li>
          ))}
        </ul>
        {!showDocUpload && (
          <CustomButton type="button" onClick={() => setShowDocUpload(true)} disabled={busy} variant="outlined" className="!border-gray-300 !text-gray-700 mt-2">
            <Plus className="w-4 h-4 mr-1 inline" /> Upload document
          </CustomButton>
        )}
        {showDocUpload && (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-800">Upload document</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectDropdown label="Document type" name="document_type" value={docUpload.document_type} onChange={(e) => { const v = e.target?.value; setDocUpload((p) => ({ ...p, document_type: (v && typeof v === 'object' && 'value' in v ? v.value : v) || p.document_type })); }} options={DOCUMENT_TYPES} disabled={busy} />
              <CustomInput label="Title (optional)" name="title" value={docUpload.title} onChange={(e) => setDocUpload((p) => ({ ...p, title: e.target.value }))} disabled={busy} />
              <div className="md:col-span-2">
                <label className="block text-xs text-gray-500 mb-1">File</label>
                <input type="file" onChange={(e) => setDocUpload((p) => ({ ...p, file: e.target.files?.[0] ?? null }))} className="w-full text-sm" disabled={busy} />
              </div>
            </div>
            <div className="flex gap-2">
              <CustomButton type="button" onClick={handleDocUpload} disabled={busy || !docUpload.file} loading={uploading}>Upload</CustomButton>
              <CustomButton type="button" variant="outlined" onClick={() => { setShowDocUpload(false); setDocUpload({ file: null, document_type: 'resume', title: '' }); }} disabled={busy}>Cancel</CustomButton>
            </div>
          </div>
        )}
      </div>

      <CustomModal
        open={deleteModal.open}
        close={() => setDeleteModal({ open: false, type: '', id: null, label: '' })}
        title="Confirm delete"
        isDelete
        primaryButtonText="Delete"
        handleSave={handleDelete}
        disableSave={deleting}
        loading={deleting}
        noFooter={false}
      >
        <p className="text-sm text-gray-700">Are you sure you want to delete “{deleteModal.label}”? This cannot be undone.</p>
      </CustomModal>
    </div>
  );
}
