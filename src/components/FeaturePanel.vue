<template>
  <div class="feature-panel">
    <h3>{{ title }}</h3>
    <div class="content">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="value" label="测量值" />
        <el-table-column prop="unit" label="单位" width="80" />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '功能面板'
    }
  },
  data() {
    return {
      tableData: [
        { time: '08:00:00', value: 12.34, unit: 'kg' },
        { time: '08:00:05', value: 56.78, unit: 'm' },
        { time: '08:00:10', value: 90.12, unit: '℃' }
      ]
    }
  }
}
</script>

<style scoped>
.feature-panel {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  margin: 20px 0;
}
.feature-panel h3 {
  color: #303133;
  margin-bottom: 15px;
}
</style>