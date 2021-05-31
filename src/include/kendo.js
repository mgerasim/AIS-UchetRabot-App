//общий файл для загрузки kendo

import Vue from 'vue';

//тема
import '@progress/kendo-theme-bootstrap/dist/all.css';

//контролы
import '@progress/kendo-ui';

//нативные
import { Grid, GridToolbar  } from '@progress/kendo-vue-grid';
import { DropDownList } from '@progress/kendo-vue-dropdowns';
import { NumericTextBox, Input } from '@progress/kendo-vue-inputs';

//обертки
import { KendoDataSourceInstaller } from '@progress/kendo-datasource-vue-wrapper';
import { KendoWindowInstaller } from '@progress/kendo-window-vue-wrapper';
import { KendoLayoutInstaller } from '@progress/kendo-layout-vue-wrapper';
import { KendoDropdownsInstaller } from '@progress/kendo-dropdowns-vue-wrapper';
import { KendoDropDownTreeInstaller } from '@progress/kendo-dropdowntree-vue-wrapper';
import { KendoTreeViewInstaller } from '@progress/kendo-treeview-vue-wrapper';
import { KendoTreeListInstaller } from '@progress/kendo-treelist-vue-wrapper';
import { KendoDateinputsInstaller } from '@progress/kendo-dateinputs-vue-wrapper';
import { KendoInputsInstaller } from '@progress/kendo-inputs-vue-wrapper';
import { KendoListBoxInstaller } from '@progress/kendo-listbox-vue-wrapper';
import { KendoPopupsInstaller } from '@progress/kendo-popups-vue-wrapper';

//локализация
import { IntlProvider, load, LocalizationProvider, loadMessages } from '@progress/kendo-vue-intl';
import '@progress/kendo-ui/js/messages/kendo.messages.ru-RU';
import '@progress/kendo-ui/js/cultures/kendo.culture.ru-RU';
kendo.culture("ru-RU");

// import likelySubtags from 'cldr-core/supplemental/likelySubtags.json';
// import currencyData from 'cldr-core/supplemental/currencyData.json';
// import weekData from 'cldr-core/supplemental/weekData.json';
// import numbers from 'cldr-numbers-full/main/es/numbers.json';
// import currencies from 'cldr-numbers-full/main/es/currencies.json';
// import caGregorian from 'cldr-dates-full/main/es/ca-gregorian.json';
// import dateFields from 'cldr-dates-full/main/es/dateFields.json';
// import timeZoneNames from 'cldr-dates-full/main/es/timeZoneNames.json';


//регистрируем грид, для него установщика нет, он нативный теперь
Vue.component('Grid', Grid);
Vue.component('grid-toolbar', GridToolbar);
Vue.component('dropdownlist', DropDownList);
Vue.component('numerictextbox', NumericTextBox);
Vue.component('localization-provider', LocalizationProvider);
Vue.component('intl-provider', IntlProvider);

//регистрируем
Vue.use(KendoDataSourceInstaller);
Vue.use(KendoWindowInstaller);
Vue.use(KendoLayoutInstaller);
Vue.use(KendoDropdownsInstaller);
Vue.use(KendoDropDownTreeInstaller);
Vue.use(KendoDateinputsInstaller);
Vue.use(KendoInputsInstaller);
Vue.use(KendoTreeViewInstaller);
Vue.use(KendoTreeListInstaller);
Vue.use(KendoListBoxInstaller);
Vue.use(KendoPopupsInstaller);

load(
    require("@/localization/supplemental/likelySubtags.json"),
    require("@/localization/supplemental/currencyData.json"),
    require("@/localization/supplemental/weekData.json"),

    require("@/localization/main/ru/numbers.json"),
    require("@/localization/main/ru/currencies.json"),
    require("@/localization/main/ru/ca-gregorian.json"),
    require("@/localization/main/ru/dateFields.json"),
    require("@/localization/main/ru/timeZoneNames.json")
);


const ruMessages = {
    "datepicker": {
        "toggleCalendar": "Alternar calendario"
    },
    "calendar": {
        "today": "Hoy"
    },
    "dateinput": {
        "increment": "Incrementar valor",
        "decrement": "Disminuir valor"
    },
    "dropdowns": {
        "nodata": "NO DATA FOUND.",
        "clear": "Clear",
    },
    "numerictextbox": {
        "increment": "Увеличить значение",
        "decrement": "Уменьшить значение"
    },
    "grid": {
        "groupPanelEmpty": "Drag a column header and drop it here to group by that column",
        "pagerItemsPerPage": "items per page",
        "pagerInfo": "{0} - {1} of {2} items",
        "pagerFirstPage": "Go to the first page",
        "pagerPreviousPage": "Go to the previous page",
        "pagerNextPage": "Go to the next page",
        "pagerLastPage": "Go to the last page",
        "pagerPage": "Page",
        "pagerOf": "of",
        "filterClearButton": "Clear",
        "filterEqOperator": "Is equal to",
        "filterNotEqOperator": "Is not equal to",
        "filterIsNullOperator": "Is null",
        "filterIsNotNullOperator": "Is not null",
        "filterIsEmptyOperator": "Is empty",
        "filterIsNotEmptyOperator": "Is not empty",
        "filterStartsWithOperator": "Starts with",
        "filterContainsOperator": "Contains",
        "filterNotContainsOperator": "Does not contain",
        "filterEndsWithOperator": "Ends with",
        "filterGteOperator": "Is greater than or equal to",
        "filterGtOperator": "Is greater than",
        "filterLteOperator": "Is less than or equal to",
        "filterLtOperator": "Is less than",
        "filterIsTrue": "Is true",
        "filterIsFalse": "Is false",
        "filterBooleanAll": "(All)",
        "filterAfterOrEqualOperator": "Is after or equal to",
        "filterAfterOperator": "Is after",
        "filterBeforeOperator": "Is before",
        "filterBeforeOrEqualOperator": "Is before or equal to",
        "noRecords": "Нет доступных записей.",
    }
};
loadMessages(ruMessages, 'ru-RU');