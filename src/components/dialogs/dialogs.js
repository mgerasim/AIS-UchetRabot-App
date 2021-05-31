import RequestString from "@/components/dialogs/request-string";
import RequestText from "@/components/dialogs/request-text";
import RequestAction from "@/components/dialogs/request-action";
import RequestItem from "@/components/dialogs/request-item";
import Message from "@/components/dialogs/message";

const Dialog = {};
Dialog.install = Vue => {
	Vue.prototype.$dialogs = new Vue({
		name: "$dialogs",

		methods: {
			/**
			 * Диалог редактирования строки
			 *
			 * @param {*} { required, title, message, value }
			 * @returns
			 */
			requestString({ required, title, message, value }) {
				return new Promise((resolve, reject) => {
					this.$modals.open({
						component: RequestString,
						props: {
							required: required,
							title: title,
							message: message,
							value: value
						},
						onClose(text) {
							// data мы будем передавать при закрытии окна
							// здесь мы уже в родительской области видимости, и используем data как нам нужно
							setTimeout(() => {
								resolve(text);
							}, 0);
							return true; // если здесь мы вернем false, то окно не закроется. Например при каком-то условии, по значениям из data
						},
						onDismiss() {}
					});
				});
			},

			/**
			 * Диалог редактирования текста (несколько строк)
			 *
			 * @param {*} { required, title, message, value }
			 * @returns
			 */
			requestText({ required, title, message, value }) {
				return new Promise((resolve, reject) => {
					this.$modals.open({
						component: RequestText,
						props: {
							required: required,
							title: title,
							message: message,
							value: value
						},
						onClose(text) {
							// data мы будем передавать при закрытии окна
							// здесь мы уже в родительской области видимости, и используем data как нам нужно
							setTimeout(() => {
								resolve(text);
							}, 0);
							return true; // если здесь мы вернем false, то окно не закроется. Например при каком-то условии, по значениям из data
						},
						onDismiss() {}
					});
				});
			},

            //#region Show Message

			/**
			 * Диалог сообщения
			 *
			 * @param {*} { title, message, icon }
			 * @returns
			 */
			message({ title, message, icon = null }) {
				return new Promise((resolve, reject) => {
					this.$modals.open({
						component: Message,
						props: {
							title: title,
							message: message,
							icon: icon,
						},
						onClose() {
							// здесь мы уже в родительской области видимости, и используем data как нам нужно
							setTimeout(() => {
								//закрыти нажатием кнопки ОК
								resolve(true);
							}, 0);
							return true; // если здесь мы вернем false, то окно не закроется. Например при каком-то условии, по значениям из data
						},
						onDismiss() {
							setTimeout(() => {
								//закрыли нажатием [X]
								resolve(false);
							}, 0);
						}
					});
				});
            },
            
			/**
			 * Диалог сообщения об ошибке
			 *
			 * @param {*} { title, message }
			 * @returns
			 */
			error(title, message) {
                return this.message({ title: title, message: message, icon: 'error' });
            },

			/**
			 * Диалог предупреждения
			 *
			 * @param {*} { title, message }
			 * @returns
			 */
			warning(title, message) {
                return this.message({ title: title, message: message, icon: 'warning' });
            },

			/**
			 * Информационный диалог
			 *
			 * @param {*} { title, message }
			 * @returns
			 */
			info(title, message) {
                return this.message({ title: title, message: message, icon: 'info' });
            },

            //#endregion Show Message

            //#region Request Action

			/**
			 * Диалог запроса действия
			 *
			 * @param {*} { title, message, actions }
			 * @returns
			 */
			requestAction({ title, message, actions = [], defaultActionKey = null, icon = null }) {
				return new Promise((resolve, reject) => {
					this.$modals.open({
						component: RequestAction,
						props: {
							title: title,
							message: message,
                            actions: actions,
							defaultActionKey: defaultActionKey,
							icon: icon,
						},
						onClose(key) {
							setTimeout(() => {
								resolve(key);
							}, 0);
							return true;
						},
						onDismiss() {}
					});
				});
			},

            //#endregion Request Action

			/**
			 * Диалог запроса выбора элемента из списка
			 *
			 * @param {*} { required, title, message, items, selected }
			 * @returns
			 */
			requestItem({ required, title, message, items = [], selected = null }) {
				return new Promise((resolve, reject) => {
					this.$modals.open({
						component: RequestItem,
						props: {
							required: required, 
							title: title,
							message: message,
                            items: items,
							selected: selected,
						},
						onClose(item) {
							setTimeout(() => {
								resolve(item);
							}, 0);
							return true;
						},
						onDismiss() {}
					});
				});
			},
		}
	});
};

if (typeof window !== "undefined" && window.Vue) {
	window.Vue.use(Dialog);
}

export default Dialog;
