<template>
  <div class="videoCate">
    <div class="main">
      <el-card class="box-card"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
      >
      <div slot="header" class="clearfix">
        <span>视频类型列表</span>
        <el-button style="float: right" type="success" size="medium"  @click="dialogFormVisible = true">新增视频类型</el-button>
      </div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="视频类型名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="channelId"
            label="所属频道"
            >
            <template slot-scope="scope">
              {{filterChannel(scope.row.channelId)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="summary"
            label="简介">
            <template slot-scope="scope">
              <el-input type="textarea" :autosize="{minRows:2,maxRows:4}" :readonly="true" v-model="scope.row.summary"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button @click="del(scope.row.id)" type="danger" size="mini">删除</el-button>
              <el-button @click="edit(scope.row.id)" type="primary" size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[4, 8, 12, 16]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="count">
        </el-pagination>
      </el-card>

    </div>
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" @close="clearData">
      <el-form :model="form">
        <el-form-item label="类型名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属频道" :label-width="formLabelWidth">
          <el-select v-model="form.channelId" placeholder="请选择">
            <el-option
            v-for="(channel,index) in channelList"
            :key="index"
            :label="channel.name"
            :value="channel.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型简介" :label-width="formLabelWidth">
          <el-input type="textarea"  placeholder="请输入类型简介" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.summary"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { list, add, del, getItemById, update } from '@/api/videoCate'
import { getChannel } from '@/api/channel'

export default {
  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogFormTitle: '新增电影类型',
      form: {
        name: '',
        summary: '',
        channelId: ''
      },
      formLabelWidth: '120px',
      operationType: 1, // 操作类型 1增加 2更新,
      currentPage: 1,
      pageSize: 4,
      count: 0,
      channelList: []
    }
  },
  created() {
    this.getList()
    this.getChannelList()
  },
  methods: {
    filterChannel(channelId) {
      const { channelList } = this
      for (let i = 0; i < channelList.length; i++) {
        if (channelList[i].id === channelId) {
          return channelList[i].name
        }
      }
    },
    clearData() {
      this.form = { name: '', summary: '', channelId: '' }
      this.dialogFormTitle = '新增电影类型'
    },
    getChannelList() {
      const params = {
        token: getToken()
      }
      getChannel(params).then(res => {
        this.channelList = res.data
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      // this.getToken({pageSize:this.pageSize,})
      this.loading = true
      this.currentPage = val
      this.getList()
    },
    // 获取列表
    getList() {
      const page = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      const params = {
        token: getToken(),
        ...page
      }
      list(params).then(res => {
        this.loading = false
        this.tableData = res.data
        this.count = res.count
      })
    },
    del(id) {
      this.$confirm('此操作将永久删除是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    },
    edit(id) {
      this.operationType = 2
      this.dialogFormTitle = '编辑视频类型'
      this.dialogFormVisible = true
      getItemById(id).then(res => {
        this.form = res.data
      })
    },
    // 新增
    add() { // 1 新增 2更新
      if (this.operationType === 1) {
        add(this.form).then(res => {
          if (res.code === 20000) {
            this.$message.success(res.message)
            this.dialogFormVisible = false
            this.getList()
          }
        })
      } else {
        update(this.form).then(res => {
          if (res.code === 20000) {
            this.$message.success(res.message)
            this.dialogFormVisible = false
            this.getList()
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.videoCate{
  padding-left: 40px;
  padding-top:50px;
  .main{
    width: 80%;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;

  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>