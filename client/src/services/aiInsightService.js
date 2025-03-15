export const aiInsightsService = {
    getInsights: async (type = 'strategic') => {
        const response = await axios.get(`/api/ai-insights?type=${type}`);
        return response.data;
    },
    
    getSegmentDetails: async () => {
        const response = await axios.get('/api/segment-details');
        return response.data;
    },
    
    getRevenueForecast: async () => {
        const response = await axios.get('/api/revenue-forecast');
        return response.data;
    }
    };