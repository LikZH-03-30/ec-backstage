<template>
  <div>
    <el-button type="primary" @click="addRole = true">添加角色</el-button>
    <el-dialog
      title="添加角色对话框"
      :visible.sync="addRole"
      ref="addRoleRef"
      width="50%"
      height="50%"
      @close="addDialog"
    >
      <!-- 弹框底部取消和确定区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRole = false">取 消</el-button>
        <el-button type="primary" @click="addRoleover">确 定</el-button>
      </span>
      <!-- 添加用户的表单 -->
      <el-form
        :model="addForms"
        :rules="addRuleyanzheng"
        ref="ruleFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForms.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForms.roleDesc"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 控制显示与隐藏
      addRole: false,
      addForms: {
        roleName: '', // 角色名称
        roleDesc: '' // 角色描述
      },
      // 表单的验证
      addRuleyanzheng: {
        roleName: [
          {
            required: true,
            message: '角色名称不能为空',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '角色名称只能在3-10个字符之间',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '角色描述不能为空',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '角色描述名只能在3-10个字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    addRoleover() {
      // console.log(11)
      this.$refs.ruleFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return this.$message.error('请输入正确格式')
        const { data: res } = await this.$http.post('roles', this.addForms)
        // console.log(res)
        if (res.meta.status !== 201) { return this.$message.error('添加角色失败！') }
        this.$message.success('添加角色成功')
        // 渲染页面
        this.$emit('getRolesList')
        // 关闭弹层
        this.addRole = false
      })
    },
    // 监听添加用户对话框关闭事件 清空内容
    addDialog() {
      // 点击取消 在次点击之后清空弹框里面的内容
      this.$refs.ruleFormRef.resetFields()
    }
  }
}
</script>

<style></style>
