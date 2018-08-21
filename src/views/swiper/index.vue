<template>
  <div class="swiper">
    <div class="main">
      <el-card class="box-card"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
      >
      <div slot="header" class="clearfix">
        <span>轮播图列表</span>
        <el-button style="float: right" type="success" size="medium"  @click="dialogShow">新增轮播图</el-button>
      </div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="title"
            label="轮播图标题"
            >
          </el-table-column>
          <el-table-column
            prop="url"
            label="轮播图"
            >
            <template slot-scope="scope">
                <img  width="300" height="100" :src="'http://'+scope.row.url" alt="">
            </template>
          </el-table-column>
          <el-table-column
            prop="link"
            label="轮播图链接">
            <!-- <template slot-scope="scope">
              <el-input type="textarea" :autosize="{minRows:2,maxRows:4}" :readonly="true" v-model="scope.row.summary"></el-input>
            </template> -->
          </el-table-column>
          <el-table-column
            label="操作"
            >
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
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="轮播图标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="轮播图链接" :label-width="formLabelWidth">
          <el-input type="textarea"  placeholder="请输入轮播图链接" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.link"></el-input>
        </el-form-item>
        <el-form-item label="轮播图图片" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="//upload-z1.qiniup.com/"
            :show-file-list="false"
            :data="qiniuToken"
            :on-success="uploadSuccess"
            :before-upload="beforeUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSwiper">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { getSwiper, addSwiper, delSwiper, getSwiperById, updateSwiper } from '@/api/swiper'

export default {
  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogFormTitle: '新增轮播图',
      form: {
        title: '',
        url: '',
        link: ''
      },
      formLabelWidth: '120px',
      imageUrl: '',
      qiniuUrl: '',
      qiniuToken: {
      },
      operationType: 1, // 操作类型 1增加 2更新,
      currentPage: 1,
      pageSize: 4,
      count: 0
    }
  },
  created() {
    this.getSwiper()
    this.getQiniuToken()
  },
  methods: {
    dialogShow() {
      this.dialogFormVisible = true,
      this.form = { title: '', link: '', url: '' }
      this.imageUrl = ''
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      // this.getToken({pageSize:this.pageSize,})
      this.loading = true
      this.currentPage = val
      this.getSwiper()
    },
    // 获取七牛token
    getQiniuToken() {
      this.http('/api/v1/getToken/getQiniuToken', {}).then(res => {
        console.log(res)
        this.qiniuToken = res.token
        this.qiniuToken = {
          token: res.token
        }
        this.qiniuUrl = res.url
      })
    },
    // 获取轮播图列表
    getSwiper() {
      const page = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize
      }
      const params = {
        token: getToken(),
        ...page
      }
      getSwiper(params).then(res => {
        console.log(res)
        this.loading = false
        this.tableData = res.data
        this.count = res.count
      })
    },
    del(id) {
      console.log(id)
      this.$confirm('此操作将永久删除是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSwiper(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getSwiper()
        })
      })
    },
    edit(id) {
      console.log(id)
      this.operationType = 2
      this.dialogFormTitle = '编辑频道'
      this.dialogFormVisible = true
      getSwiperById(id).then(res => {
        this.form = res.data
        this.imageUrl = 'http://' + res.data.url
      })
    },
    // 新增轮播图
    addSwiper() { // 1 新增 2更新
      console.log(this.form)
      if (this.operationType === 1) {
        addSwiper(this.form).then(res => {
          if (res.code === 20000) {
            this.$message.success(res.message)
            this.dialogFormVisible = false
            this.getSwiper()
          }
        })
      } else {
        updateSwiper(this.form).then(res => {
          if (res.code === 20000) {
            this.$message.success(res.message)
            this.dialogFormVisible = false
            this.getSwiper()
          }
        })
      }
      this.form = { title: '', url: '', link: '' }
      this.imageUrl = ''
    },
    uploadSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.form.url = `${this.qiniuUrl}/${res.key}`
    },
    beforeUpload(file) {
      // const isJPG = file.type === 'image/jpeg/png';
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M

      // return isJPG && isLt2M;
    }
  }
}
</script>

<style lang="scss" scoped>
.swiper{
  padding-left: 40px;
  padding-top:50px;
  .main{
    width: 100%;
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