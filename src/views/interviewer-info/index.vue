<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchParams.name" placeholder="面试官名字" style="width: 200px;" class="filter-item" @keyup.enter.native="getList" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-switch
        v-model="searchParams.alert"
        active-text="需培训"
      />
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-upload2" @click="handleUpload">
        上传
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-download" @click="handleDownload">
        下载
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="姓名" width="150px" align="center" prop="name" />
      <el-table-column label="性别" width="150px" align="center" prop="gender" />
      <el-table-column label="所属公司" width="150px" align="center" prop="affiliatedCompany" />
      <el-table-column label="部门" width="150px" align="center" prop="department" />
      <el-table-column label="职务" width="150px" align="center" prop="jobTitle" />
      <el-table-column label="面试官级别" width="150px" align="center" prop="level" />
      <el-table-column label="工作属地" width="150px" align="center" prop="workingTerritory" />
      <el-table-column label="培训/复训日期" align="center" prop="trainingDate">
        <template slot-scope="{row}">
          <span>{{ getTimes(row.trainingDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="面试场次" width="150px" align="center" prop="interviewFrequency" />
      <el-table-column label="面试人数" width="150px" align="center" prop="interviewNumber" />
      <el-table-column label="通过人数" width="150px" align="center" prop="passNumber" />
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, prev, pager, next"
      :page-size="20"
      :current-page.sync="currentPage"
      :total="total"
      @current-change="handleCurrentChange"
    />

    <!-- 新增弹窗 -->
    <el-dialog title="新增面试官" :visible.sync="addEditDialogFlag">
      <el-form ref="dataForm" label-position="left" label-width="200px" style="margin-left:50px;">
        <el-form-item label="姓名">
          <el-input v-model="addEditForm.name" placeholder="面试官名字" style="width: 200px;" :disabled="!(dialogStatus==='create')" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addEditForm.gender" :disabled="!(dialogStatus==='create')">
            <el-radio label="男" />
            <el-radio label="女" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属公司">
          <el-select v-model="addEditForm.affiliatedCompany" class="filter-item" placeholder="所属公司">
            <el-option v-for="item in companyList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="addEditForm.department" />
        </el-form-item>
        <el-form-item label="职务">
          <el-input v-model="addEditForm.jobTitle" />
        </el-form-item>
        <el-form-item label="面试官级别">
          <el-select v-model="addEditForm.level" class="filter-item" placeholder="级别">
            <el-option v-for="item in levelList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="工作属地">
          <el-input v-model="addEditForm.workingTerritory" />
        </el-form-item>
        <el-form-item label="培训/复训日期">
          <el-date-picker
            v-model="addEditForm.trainingDate"
            type="date"
            placeholder="选择日期"
            value-format="timestamp"
          />
        </el-form-item>
        <el-form-item label="面试场次">
          <el-input v-model="addEditForm.interviewFrequency" />
        </el-form-item>
        <el-form-item label="面试人数">
          <el-input v-model="addEditForm.interviewNumber" />
        </el-form-item>
        <el-form-item label="通过人数">
          <el-input v-model="addEditForm.passNumber" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addEditDialogFlag = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as interviewerApis from '@/api/interviewer'
import waves from '@/directive/waves'

export default {
  name: 'InterviewerInfo',
  directives: { waves },
  data() {
    return {
      listLoading: false,
      list: [],
      currentPage: 1,
      total: 0,
      searchParams: {
        name: '',
        alert: false
      },
      // 弹窗
      addEditDialogFlag: false,
      dialogStatus: 'create',
      companyList: [
        '海航技术',
        '大新华飞维',
        '海航汉莎',
        'APC'
      ],
      levelList: [
        '初级',
        '高级',
        '资深'
      ],
      addEditForm: {
        name: '',
        gender: '',
        affiliatedCompany: '',
        department: '',
        jobTitle: '',
        level: '',
        workingTerritory: '',
        trainingDate: '',
        interviewFrequency: '',
        interviewNumber: '',
        passNumber: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const params = {
        pageNum: this.currentPage,
        pageSize: 20
      }
      if (this.searchParams.alert) {
        params.alert = true
        const res = await interviewerApis.getList(params)
        if (res.success) {
          this.list = res.data.result
          this.total = res.data.total
        } else {
        // 报错
        }
      } else {
        params.alert = false
        if (this.searchParams.name) params.name = this.searchParams.name
        const res = await interviewerApis.getList(params)
        if (res.success) {
          this.list = res.data.result
          this.total = res.data.total
        } else {
        // 报错
        }
      }

      // const res = await interviewerApis.getList(params)

      this.listLoading = false
    },
    handleCreate() {
      this.addEditDialogFlag = true
      this.dialogStatus = 'create'
      this.addEditForm = {
        name: '',
        gender: '',
        affiliatedCompany: '',
        department: '',
        jobTitle: '',
        level: '',
        workingTerritory: '',
        trainingDate: '',
        interviewFrequency: '',
        interviewNumber: '',
        passNumber: ''
      }
    },
    async createData() {
      const res = await interviewerApis.addInterviewer(this.addEditForm)
      if (res.success) {
        this.$message('添加成功')
        this.addEditDialogFlag = false
        this.getList()
      } else {
        // 报错
      }
    },
    async updateData() {
      const res = await interviewerApis.editInterviewer(this.editId, this.addEditForm)
      if (res.success) {
        this.$message('修改成功')
        this.addEditDialogFlag = false
        this.getList()
      } else {
        // 报错
      }
    },
    handleUpdate(row) {
      this.addEditDialogFlag = true
      // debugger
      this.addEditForm = row
      this.editId = row._id
      this.dialogStatus = 'edit'
    },
    async handleDelete(row) {
      this.$confirm('此操作删除该面试官, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await interviewerApis.deleteInterviewer({ userId: row._id })
        if (res) {
          this.getList()
        }
      }).catch(() => {}) // do nothing
    },
    handleCurrentChange(index) {
      this.currentPage = index
      this.getList()
    },
    handleGetAlertMembers() {
      this.searchParams.alert = true
      this.getList()
    },
    getTimes(time) {
      const currTimeDate = new Date(Number(time))
      return `${currTimeDate.getFullYear()}-${currTimeDate.getMonth() + 1}-${currTimeDate.getDate()}`
    },
    handleDownload() {
      window.open('http://127.0.0.1:7001/api/downloadExcel')
    },
    async handleUpload() {
      const res = await interviewerApis.uploadExcel()
      console.log(res)
    }
  }
}
</script>
