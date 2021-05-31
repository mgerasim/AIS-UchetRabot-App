<template>
  <div class="page">
    <div id="nav">
      <router-link to="/admin/settings">Настройки приложения</router-link>
      <router-link to="/admin/pipeline">Нефтепровод</router-link>
      <router-link to="/admin/branch">Подразделения</router-link>
      <router-link to="/admin/department">Отделы</router-link>
      <router-link to="/admin/objectType">Типы объектов</router-link>
      <router-link to="/admin/object">Объекты</router-link>
      <router-link to="/admin/user">Пользователи системы</router-link>
      <router-link to="/admin/person">Сотрудники</router-link>
      <router-link to="/admin/branchSystem">Системы</router-link>
      <router-link to="/admin/masksManager">Защиты</router-link>
    </div>
    <router-view style="flex: 1 1 100%; min-height: 0;" />
  </div>
</template>

<style lang="scss">
#nav {
  flex: 0 0 200px;
  display: flex;
  flex-flow: column nowrap;
  padding: 16px 0px;
  a {
    width: 100%;
    padding: 8px 16px;
    color: #2c3e50;
    &.router-link-exact-active {
      background-color: #dddddd;
      font-weight: bold;
    }
    &:hover {
      background-color: #d0d0d0;
      text-decoration: none;
    }
  }
}

.page {
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
}

</style>
