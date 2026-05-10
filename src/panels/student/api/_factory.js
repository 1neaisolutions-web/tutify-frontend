export const makeApi = (dataGetter) => {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const LATENCY = () => 300 + Math.random() * 400;
  const ERROR_RATE = import.meta.env.DEV ? 0 : 0;

  return {
    async fetchAll(filters = {}) {
      await delay(LATENCY());
      if (Math.random() < ERROR_RATE) throw new Error('Simulated network error');
      const items = dataGetter(filters) || [];
      return { data: items, total: items.length, page: filters.page || 1, pageSize: filters.pageSize || items.length };
    },
    async fetchById(id) {
      await delay(LATENCY());
      if (Math.random() < ERROR_RATE) throw new Error('Simulated network error');
      const item = (dataGetter() || []).find((i) => String(i.id) === String(id));
      if (!item) throw new Error(`Not found: ${id}`);
      return { data: item };
    },
    async create(payload) {
      await delay(LATENCY() + 200);
      const item = { id: `gen_${Date.now()}`, createdAt: new Date().toISOString(), ...payload };
      return { data: item };
    },
    async update(id, payload) {
      await delay(LATENCY());
      return { data: { id, ...payload, updatedAt: new Date().toISOString() } };
    },
    async delete(id) {
      await delay(LATENCY());
      return { data: { id, deleted: true } };
    },
  };
};

