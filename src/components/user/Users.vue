<template>
  <div>
    <!-- 面包屑导航头部 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索加按钮
      :span="8"  搜索框的长度
      :gutter="20" 给搜索框和按钮 添加间距
      -->
      <!-- 搜索和添加和修改和删除区域 -->
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input
            clearable
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @clear="getUserList"
            ><el-button
              @click="getUserList"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="isShowVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- {{ scope.status }} -->
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              @click="removeUserById(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                @click="AllotRole(scope.row)"
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>

    <!-- 点击提交的弹出框 -->
    <el-dialog
      title="添加用户对话框"
      :visible.sync="isShowVisible"
      width="50%"
      height="50%"
      @close="addDialog"
    >
      <!-- 弹框底部取消和确定区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
      <!-- 添加用户的表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="ruleFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 点击修改用户对话框 -->
    <el-dialog
      @close="editDialogCloseed"
      title="编辑用户"
      :visible.sync="editDialogVisble"
      width="50%"
    >
      <!-- 修改弹出框的表单验证 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名称">
          <!-- disabled  禁止输入 -->
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog @close='editDialogClosed' title="提示" :visible.sync="setRoleDialogVisible" width="50%">
      <div>
        <p>当前的用户:{{ userInfo.username }}</p>
        <p>当前的角色:{{ userInfo.role_name }}</p>
        <p>
          分配当前新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="seveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getUserState } from '@/api'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '用户名只能在3-10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码只能在6-15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          {
            pattern: /^[1-9][0-9]{4,}@qq.com$/,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '手机号不能为空',
            trigger: 'blur'
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ]
      },
      isShowVisible: false, // 弹出框默认是关闭
      // 控制修改用户对话框的显示与隐藏
      editDialogVisble: false,
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 需要被分配的用户信息
      userInfo: {},
      // 分配角色的数据列表
      rolesList: [],
      // 分配角色双向绑定的v-model变量
      selectedRoleId: '',
      // 修改弹出框用户的表单验证
      editFormRules: {
        email: [
          {
            required: true,
            message: '邮箱不能为空',
            trigger: 'blur'
          },
          {
            pattern: /^[1-9][0-9]{4,}@qq.com$/,
            message: '邮箱格式不正确',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '手机号不能为空',
            trigger: 'blur'
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户信息
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // 监听 pagesize改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      // 每页有多少条数据
      this.queryInfo.pagesize = newSize
      // 渲染下页面获取下数据
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      // 渲染下页面获取下数据
      this.getUserList()
    },
    // 监听状态按钮的变化
    async userStateChanged(userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听添加用户对话框关闭事件 清空内容
    addDialog() {
      // 点击取消 在次点击之后清空弹框里面的内容
      this.$refs.ruleFormRef.resetFields()
    },
    // 点击确定按钮添加新用户和校验表单
    addUser() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        // 如果验证通过就发起请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败')
        this.$message.success('添加用户成功')
        // 添加成功之后重新渲染页面
        this.getUserList()
        this.isShowVisible = false // 吧弹出层关闭
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisble = true
      // console.log(res)
    },
    // 监听修改用户对话框的关闭事件 清空对话框
    editDialogCloseed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        // 如果验证通过就发起请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
        console.log(this.editForm.id)
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        this.$message.success('更新用户信息成功')
        // 添加成功之后重新渲染页面
        this.getUserList()
        this.editDialogVisble = false // 吧弹出层关闭
      })
    },
    // 根据id删除对应的用户信息
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((error) => error)
      // 如果用户确认删除则返回一个字符串 confirm
      // 如果用户取消删除则返回一个字符串 cancel
      if (confirmResult !== 'confirm') return this.$message.info('取消了删除')
      // 如果点击了删了，这边就要发起一个删除单个用户的请求
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      // 渲染页面
      this.getUserList()
      // console.log('成功删除')
    },
    // 点击分配角色 弹出的业务
    async AllotRole(userInfo) {
      // 获取用户信息
      this.userInfo = userInfo
      // 弹层显示之前获取所有分配角色数据
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表属性失败')
      }
      // 吧他存到数组中
      this.rolesList = res.data
      // 打开弹层
      this.setRoleDialogVisible = true
      // console.log(res)
    },
    // 点击按钮让用户分配角色
    async seveRoleInfo() {
      // 判断用户有没有选择分配角色
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的用户角色')
      }
      // 如果分配了就是点了确定,那么走下面的逻辑
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
      if (res.meta.status !== 200) return this.$message.error('更新角色失败')
      this.$message.success('更新角色成功')
      this.getUserList()
      // 关闭弹层
      this.setRoleDialogVisible()
    },
    // 分配完角色之后重置下拉框里的内容
    editDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = ''
    }
  }
}
</script>

<style></style>
