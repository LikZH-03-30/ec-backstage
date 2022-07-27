<template>
  <div>
    <!-- 角色列表头部 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 角色列表主体卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <!-- 给添加角色按钮绑定点击事件,弹出一个对话框 -->
          <AddRoles @getRolesList="getRolesList" />
          <!-- <el-button type="primary" @click="addRole">添加角色</el-button> -->
        </el-col>
      </el-row>
      <!-- 角色列表列 -->
      <el-table :data="RolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column label="#" type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'juzhong']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag @close="removeRighById(scope.row, item1.id)" closable>{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级 -->
              <el-col :span="19">
                <!-- 通过for循坏渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'juzhong']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      @close="removeRighById(scope.row, item2.id)"
                      closable
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      @close="removeRighById(scope.row, item3.id)"
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>

        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- {{ scope.status }} -->
            <!-- 编辑按钮 -->
            <el-button
              @click="RedactBtn(scope.row.id)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
              >编辑</el-button
            >
            <!-- 删除按钮 -->
            <!-- <DelRole /> -->
            <el-button
              @click="DeleteRole(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              >删除</el-button
            >
            <!-- 分配权限按钮 -->
            <el-button
              @click="showSetRightDialog(scope.row)"
              type="warning"
              icon="el-icon-setting"
              size="mini"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisble"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色信息 -->
    <el-dialog title="提示" :visible.sync="RedactVisible" width="50%">
      <!-- 修改弹出框的表单验证 -->
      <el-form ref="RedactFormRef" :model="RedactForm" :rules="RedactsFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <!-- disabled  禁止输入 -->
          <el-input v-model="RedactForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="RedactForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- ----------------- -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="RedactVisible = false">取 消</el-button>
        <el-button type="primary" @click="AmenDover">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AddRoles from '@/components/power/components/AddRoles.vue'
// import DelRole from '@/components/power/components/DelRole.vue'
export default {
  components: {
    AddRoles
    // DelRole
  },
  data() {
    return {
      // 角色列表数据
      RolesList: [],
      // 控制分配权限的显示与隐藏
      setRightDialogVisble: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
      // 控制编辑角色弹层的显示与隐藏
      RedactVisible: false,
      // 保存编辑用户信息的数据
      RedactForm: {},
      // 修改用户角色的验证规则
      RedactsFormRules: {
        roleName: [
          {
            required: true,
            message: '角色名不能为空',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '角色名只能在3-10个字符之间',
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
            min: 2,
            max: 10,
            message: '角色描述只能在2-10个字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表数据失败')
      }
      this.RolesList = res.data
      // console.log(res)
    },
    // 根据id删除对应的的权限
    async removeRighById(role, rightId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult !== 'confirm') return this.$message.info('取消了删除')
      // console.log('确认了删除')
      // 获取删除的接口
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除权限失败')
      this.$message.success('删除权限成功')
      // 渲染页面
      // this.getRolesList()
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 数据保存起来
      this.rightslist = res.data
      // console.log(this.rightslist)
      // 递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys)
      // 关闭分配权限弹框
      this.setRightDialogVisble = true
    },
    // 通过递归的形式,获取角色下所有三级权限的id,并保存到
    // defkeys数组中
    getLeafKeys(node, arr) {
      // 如果当前 node节点不包含 children 属性,则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击确定为角色分配权限
    async allotRights() {
      const keys = [
        //  全选
        ...this.$refs.treeRef.getCheckedKeys(),
        //  半选
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      // 吧获取到的id以字符串形式分割
      const idStr = keys.join(',')
      // 发起请求  吧idStr发送给服务器端rids
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) return this.$message.error('分配权限失败')
      this.$message.success('分配权限成功')
      // 渲染页面
      this.getRolesList()
      // 关闭分配权限弹框
      this.setRightDialogVisble = false
    },
    // 删除对应角色
    async DeleteRole(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
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
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败')
      this.$message.success('删除角色成功')
      // 渲染页面
      this.getRolesList()
      // console.log('成功删除')
    },
    // 编辑角色信息
    async RedactBtn(id) {
      // console.log(111)
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      // console.log(this.RedactForm)
      this.RedactForm = res.data
      // 关闭弹层
      this.RedactVisible = true
    },
    // 点击确认修改用户角色信息
    AmenDover() {
      this.$refs.RedactFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return
        // 如果验证通过就发起请求
        const { data: res } = await this.$http.put(
          'roles/' + this.RedactForm.roleId,
          {
            roleName: this.RedactForm.roleName,
            roleDesc: this.RedactForm.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('编辑角色信息失败')
        }
        this.$message.success('编辑角色信息成功')
        // 添加成功之后重新渲染页面
        this.getRolesList()
        this.RedactVisible = false // 吧弹出层关闭
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
  margin-left: 40px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.juzhong {
  display: flex;
  align-items: center;
}
</style>
