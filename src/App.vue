<template>
  <localization-provider class="full-size" language="ru-RU">
    <intl-provider class="full-size" locale="ru" >
      <div class="full-size">
        <div class="page-container">
          <div class="nav-container">
            <router-link to="/admin" class="nav-link">Администрирование</router-link>
            <router-link to="/LogsPage" class="nav-link">Логи</router-link>
            <router-link to="/JobsPage" class="nav-link">Работы</router-link>
            <router-link to="/PermitsPage" class="nav-link">Разрешения</router-link>
            <router-link to="/PermitTemplatesPage" class="nav-link">Шаблоны разрешений</router-link>
            <router-link to="/TestPage" class="nav-link" style="margin-left: 128px;">TEST</router-link>
            <div class="content-center" style="margin-right: 16px;">
              <a href="file://cdn01-pifs---01.dmn.tn.corp/Resources_01$/2418/АИС Учет работ">Журнал замечаний и предложений</a>
            </div>
          </div>
          <router-view style="flex: 1 1 100%; min-height: 0;" />
        </div>
        <vu-modal-wrapper></vu-modal-wrapper>
      </div>
    </intl-provider>
  </localization-provider>
</template>

<style lang="scss">
  .page-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
  }

  .nav-container {
    display: flex;
    flex-flow: row nowrap;
  }

  .nav-link {
    margin-right: 8px;
  }
</style>
