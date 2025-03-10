<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import FeaturePanel from './components/FeaturePanel.vue'
import { ElMessage } from 'element-plus'

export default {
  components: { FeaturePanel },
  setup() {
    const store = useStore()
    const settingsVisible = ref(false)
    const availablePorts = ref(['COM1', 'COM2'])


    return {
      feature1Enabled: computed(() => store.state.feature1Enabled),
      feature2Enabled: computed(() => store.state.feature2Enabled),
      feature1Settings: computed(() => store.state.feature1Settings),
      feature2Settings: computed(() => store.state.feature2Settings),
      availablePorts,
      settingsVisible,
      operationLogs: computed(() => store.state.operationLogs),
      toggleFeature1: () => {
        if (!store.state.feature1Settings.configValid) {
          ElMessage.warning('请先完成记长仪配置');
          return;
        }
        store.commit('toggleFeature1');
      },
      toggleFeature2: () => {
        if (!store.state.feature2Settings.configValid) {
          ElMessage.warning('请先完成电子秤配置');
          return;
        }
        store.commit('toggleFeature2');
      },
      saveSettings: () => {
        if (store.state.feature1Settings.configValid && 
            store.state.feature2Settings.configValid &&
            store.state.feature1Settings.comPort && 
            store.state.feature2Settings.comPort &&
            store.state.feature1Settings.comPort === store.state.feature2Settings.comPort) {
          ElMessage.warning('COM端口配置重复，请选择不同端口');
          return;
        }
        store.commit('updateFeature1Settings', store.state.feature1Settings)
        store.commit('updateFeature2Settings', store.state.feature2Settings)
        settingsVisible.value = false
        ElMessage.success('配置保存成功')
      },
      showSettingsDialog: () => {
        if (store.state.feature1Enabled || store.state.feature2Enabled) {
          const activeFeatures = [
            store.state.feature1Enabled && '记长仪',
            store.state.feature2Enabled && '电子秤'
          ].filter(Boolean);
          ElMessage.warning(`请先关闭${activeFeatures.join('和')}功能`);
          return;
        }
        settingsVisible.value = true;
      }
    }
  }
}
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="control-buttons">
          <el-button :class="{ 'feature1-active': feature1Enabled, 'feature1-inactive': !feature1Enabled }" size="large" @click="toggleFeature1">
  <span class="button-content">
    <i :class="feature1Enabled ? 'el-icon-success' : 'el-icon-error'"></i>
    记长仪 {{ feature1Enabled ? '开启' : '关闭' }}
  </span>
</el-button>
          <el-button :class="{ 'feature2-active': feature2Enabled, 'feature2-inactive': !feature2Enabled }" size="large" @click="toggleFeature2">
  <span class="button-content">
    <i :class="feature2Enabled ? 'el-icon-success' : 'el-icon-error'"></i>
    电子秤 {{ feature2Enabled ? '开启' : '关闭' }}
  </span>
</el-button>
          <el-button size="large" @click="showSettingsDialog">设置</el-button>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <feature-panel title="记长仪数据" />
      </el-col>
      <el-col :span="12">
        <feature-panel title="电子秤数据" />
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="log-section">
          <el-timeline>
            <el-timeline-item
              v-for="(log, index) in operationLogs"
              :key="index"
              :timestamp="log.timestamp"
              placement="top"
            >
              <el-card>
                <p>{{ log.message }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-col>
    </el-row>

    <el-dialog v-model="settingsVisible" title="设备配置" width="90%">
      <el-tabs type="border-card">
        <el-tab-pane label="记长仪配置">
          <el-form :model="feature1Settings">
            <el-form-item label="配置有效性">
              <el-checkbox v-model="feature1Settings.configValid">配置完成</el-checkbox>
            </el-form-item>
            <el-form-item label="COM端口">
              <el-select v-model="feature1Settings.comPort" placeholder="请选择端口">
                <el-option 
                  v-for="port in availablePorts"
                  :key="port"
                  :label="port"
                  :value="port"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="波特率">
              <el-select v-model="feature1Settings.baudRate" placeholder="请选择波特率">
                <el-option label="9600" value="9600" />
                <el-option label="115200" value="115200" />
                <el-option label="57600" value="57600" />
              </el-select>
            </el-form-item>
            <el-form-item label="轮询时间（秒）">
              <el-input-number 
                v-model="feature1Settings.pollingInterval"
                :min="1" 
                :max="9"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="心跳检测间隔（秒）">
              <el-input-number 
                v-model="feature1Settings.heartbeatInterval"
                :min="1" 
                :max="9"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="设备型号">
              <el-select v-model="feature1Settings.model" placeholder="请选择型号">
                <el-option label="LS-2000" value="LS2000" />
                <el-option label="LS-3000" value="LS3000" />
              </el-select>
            </el-form-item>

          </el-form>
        </el-tab-pane>

        <el-tab-pane label="电子秤配置">
          <el-form :model="feature2Settings">
            <el-form-item label="配置有效性">
              <el-checkbox v-model="feature2Settings.configValid">配置完成</el-checkbox>
            </el-form-item>
            <el-form-item label="COM端口">
              <el-select v-model="feature2Settings.comPort" placeholder="请选择端口">
                <el-option 
                  v-for="port in availablePorts"
                  :key="port"
                  :label="port"
                  :value="port"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="波特率">
              <el-select v-model="feature2Settings.baudRate" placeholder="请选择波特率">
                <el-option label="9600" value="9600" />
                <el-option label="115200" value="115200" />
                <el-option label="57600" value="57600" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备型号">
              <el-select v-model="feature2Settings.model" placeholder="请选择型号">
                <el-option label="EW-300A" value="EW300A" />
                <el-option label="EW-500B" value="EW500B" />
              </el-select>
            </el-form-item>
            <el-form-item label="小数位数">
              <el-select v-model="feature2Settings.decimalPlaces" placeholder="请选择位数">
                <el-option label="1位小数" :value="1" />
                <el-option label="2位小数" :value="2" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button @click="settingsVisible = false" size="large">取消</el-button>
        <el-button type="primary" @click="saveSettings" size="large">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.log-section {
  margin-top: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  min-height: 400px;
  max-height: 60vh;
  overflow-y: auto;
}

.control-buttons {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.el-row {
  margin-bottom: 20px;
}
.feature1-active {
  background-color: #409EFF !important;
  border-color: #0d47a1 !important;
  color: white !important;
}

.feature1-active i {
  color: white !important;
}

.feature2-active {
  background-color: #67C23A !important;
  border-color: #1b5e20 !important;
  color: white !important;
}

.feature2-active i {
  color: white !important;
}

.feature1-inactive i,
.feature2-inactive i {
  color: #606266 !important;
}
.feature2-inactive {
  background-color: #F0F9EB !important;
  border-color: #9e9e9e !important;
}

.inactive-style {
  background-color: #f5f5f5 !important;
  border-color: #9e9e9e !important;
  color: #616161 !important;
}

.button-content {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.control-buttons .el-button,
.el-dialog .el-button {
  padding: 15px 25px;
  font-size: 18px;
  min-width: 120px;
  line-height: 1.5;
  border-radius: 8px;
}
</style>
