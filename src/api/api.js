const API_BASE_URL = '/api';

export const systemApi = {
  exportData: async () => {
	const res = await fetch(`${API_BASE_URL}/export`);
	return await res.json();
  },

  importData: async (data) => {
	const res = await fetch(`${API_BASE_URL}/import`, {
  	method: "POST",
  	headers: {
    	"Content-Type": "application/json",
  	},
  	body: JSON.stringify(data),
	});
	return await res.json();
  }
};
