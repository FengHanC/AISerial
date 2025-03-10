import { createStore } from 'vuex';

export default createStore({
  state: {
    feature1Enabled: false,
    feature2Enabled: false,
    operationLogs: [],
    feature1Settings: {
      comPort: '',
      baudRate: '9600',
      model: 'LS2000',
      configValid: false
    },
    feature2Settings: {
      comPort: '',
      baudRate: '9600',
      model: 'EW300A',
      decimalPlaces: 1,
      configValid: false
    }
  },
  mutations: {
    toggleFeature1(state) {
      if (!state.feature1Enabled && !state.feature1Settings.configValid) {
        return;
      }
      state.feature1Enabled = !state.feature1Enabled;
      state.operationLogs.push({
        timestamp: new Date().toLocaleString(),
        message: `记长仪 ${state.feature1Enabled ? '已开启' : '已关闭'}`
      });
    },
    toggleFeature2(state) {
      if (!state.feature2Enabled && !state.feature2Settings.configValid) {
        return;
      }
      state.feature2Enabled = !state.feature2Enabled;
      state.operationLogs.push({
        timestamp: new Date().toLocaleString(),
        message: `电子秤 ${state.feature2Enabled ? '已开启' : '已关闭'}`
      });
    },
    updateFeature1Settings(state, payload) {
      state.feature1Settings = { ...state.feature1Settings, ...payload };
      localStorage.setItem('feature1Settings', JSON.stringify(state.feature1Settings));
    },
    updateFeature2Settings(state, payload) {
      state.feature2Settings = { ...state.feature2Settings, ...payload };
      localStorage.setItem('feature2Settings', JSON.stringify(state.feature2Settings));
    },
    addLog(state, log) {
      state.operationLogs.push({
        timestamp: new Date().toLocaleString(),
        message: log
      });
    }
  }
});