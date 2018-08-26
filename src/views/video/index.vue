<template>
  <div class="video">
    <div class="main">
      <el-card class="box-card"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
      >
      <div slot="header" class="clearfix">
        <span>视频视频列表</span>
        <el-button style="float: right" type="success" size="medium"  @click="dialogFormVisible = true">新增视频</el-button>
      </div>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="视频名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题"
            width="180">
          </el-table-column>
          <el-table-column
            prop="isVip"
            label="是否vip专属"
            width="180">
          </el-table-column>
          <el-table-column
            prop="videoCate_id"
            label="所属类型"
            >
            <template slot-scope="scope">
              {{filterChannel(scope.row.videoCate_id)}}
            </template>
          </el-table-column>
          <el-table-column
            prop="poster"
            label="封面"
            >
            <template slot-scope="scope">
                <img  width="150" height="200" :src="scope.row.poster" alt="">
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
      <el-form :model="form"  ref="Videoform">
        <el-form-item label="视频名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="封面标题" :label-width="formLabelWidth">
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属类型" :label-width="formLabelWidth">
          <el-select v-model="form.videoCate_id" placeholder="请选择">
            <el-option
            v-for="(videoCate,index) in videoCateList"
            :key="index"
            :label="videoCate.name"
            :value="videoCate.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="视频封面" :label-width="formLabelWidth">
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
        <el-form-item label="上传视频" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            action="//upload-z1.qiniup.com/"
            multiple
            :data="qiniuToken"
            :on-success="uploadVideoSuccess"
            :before-upload="beforeUploadVideo"
            :limit="1"
            >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传MP4文件，且不超过1g</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="导演" :label-width="formLabelWidth">
          <el-input v-model="form.director" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="演员" :label-width="formLabelWidth">
          <el-input v-model="form.actors" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="清晰度" :label-width="formLabelWidth">
          <el-input v-model="form.clarity" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="评分" :label-width="formLabelWidth">
          <el-input v-model="form.rating" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否vip专属" :label-width="formLabelWidth">
          <el-input v-model="form.isVip" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="视频简介" :label-width="formLabelWidth">
          <el-input type="textarea"  placeholder="请输入视频简介" :autosize="{ minRows: 2, maxRows: 4}" v-model="form.summary"></el-input>
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
import { list, add, del, getItemById, update } from '@/api/video'
import { list as getVideoCate } from '@/api/videoCate'

export default {
  data() {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogFormTitle: '新增视频',
      form: {
        name: '', // 名称
        title: '', // 标题
        summary: '', // 简介
        videoCate_id: '', // 所属电影类型
        poster: '', // 封面
        video_url: '', // 视频url
        actors: '', // 演员
        isVip: '', // 是否vip独有
        director: '', // 导演
        clarity: '' // 清晰度
      },
      formLabelWidth: '120px',
      operationType: 1, // 操作类型 1增加 2更新,
      currentPage: 1,
      pageSize: 4,
      count: 0,
      videoCateList: [],
      qiniuToken: {

      },
      imageUrl: '',
      qiniuUrl: ''
    }
  },
  created() {
    this.getList()
    this.getVideoCateList()
    this.getQiniuToken()
  },
  methods: {
    // 获取七牛token
    getQiniuToken() {
      this.http('/api/v1/getToken/getQiniuToken', {}).then(res => {
        this.qiniuToken = res.token
        this.qiniuToken = {
          token: res.token
        }
        this.qiniuUrl = res.url
      })
    },
    uploadSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.form.poster = `http://${this.qiniuUrl}/${res.key}`
    },
    filterChannel(videoCate_id) {
      const { videoCateList } = this
      for (let i = 0; i < videoCateList.length; i++) {
        if (videoCateList[i].id === videoCate_id) {
          return videoCateList[i].name
        }
      }
    },
    clearData() {
      this.form = { name: '', title: '', summary: '', videoCate_id: '', poster: '', video_url: '', actors: '', isVip: '', director: '', clarity: '' }
      this.imageUrl = ''
      this.dialogFormTitle = '新增视频'
      this.operationType = 1
    },
    getVideoCateList() {
      const params = {
        token: getToken()
      }
      getVideoCate(params).then(res => {
        this.videoCateList = res.data
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
      this.dialogFormTitle = '编辑视频视频'
      this.dialogFormVisible = true
      getItemById(id).then(res => {
        this.form = res.data
        this.imageUrl = res.data.poster
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
    },
    // 上传视频成功回调
    uploadVideoSuccess(res, file) {
      this.video_url = URL.createObjectURL(file.raw)
      this.form.video_url = `http://${this.qiniuUrl}/${res.key}`
    },
    beforeUploadVideo(file) {
      const isMP4 = file.type === 'mp4'
      const isLt1G = file.size / 1024 / 1024 < 1024
      if (!isMP4) {
        this.$message.error('上传视频格式只能是 MP4 格式!')
      }
      if (!isLt1G) {
        this.$message.error('上传视频大小不能超过1g!')
      }
      return isLt1G
    }
  }
}
</script>

<style lang="scss" scoped>
.video{
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