const {ipcRenderer} = window.require('electron');
export const reducer = (state, action) => {
    switch (action.type) {
        case "UPDATE_MAIN_MENU":
            return {
                ...state,
                mainMenu: action.value
            };
        case "UPDATE_SUB_MENU":
            return {
                ...state,
                subMenu: action.value
            };
        case "UPDATE_CATEGORY":
            return {
                ...state,
                category: action.value
            };
        case "UPDATE_SUB_CATEGORY":
            return {
                ...state,
                subCategory: action.value
            };
        case "UPDATE_AUTOFOCUS":
            return {
                ...state,
                autoFocus: action.value
            };
        case "RESET_MAIN_MENU":
            return {
                ...state,
                mainMenu: 0
            };
        case "RESET_SUB_MENU":
            return {
                ...state,
                subMenu: 0
            };
        case "RESET_CATEGORY":
            return {
                ...state,
                category: 0
            };
        case "RESET_SUB_CATEGORY":
            return {
                ...state,
                subCategory: 0
            };
        case "RESET_AUTOFOCUS":
            return {
                ...state,
                autoFocus: 0
            };
        case "RESET_MENU":
            return {
                mainMenu: 0,
                subMenu: 0,
                category: 0,
                subCategory: 0,
                autoFocus: 0,
            }
        case "UPDATE_USER":
            return {
                ...state,
                user: action.value
            }
        case "UPDATE_USER_LOGIN":
            const updatedUserSettingsFile = ipcRenderer.sendSync('set-user-settings', action.value);
            if (updatedUserSettingsFile) {
                return {
                    ...state,
                    user: action.value
                }
            }
            return state;
        case "LOGOUT_USER":
            const deletedUserSettingsFile = ipcRenderer.sendSync('set-user-settings', {
                name: '',
                token: '',
                refresh: ''
            });
            if (deletedUserSettingsFile) {
                return {
                    ...state,
                    user: {
                        name: '',
                        token: '',
                        refresh: ''
                    }
                }
            }
            return state;
        case 'REFRESH_USER_TOKEN':
            const refreshedUserSettingsFile = ipcRenderer.sendSync('set-user-settings', {
                ...state.user,
                refresh: action.value
            });
            if (refreshedUserSettingsFile) {
                return {
                    ...state,
                    user: {
                        ...state.user,
                        refresh: action.value
                    }
                }
            }
            return state;
        default:
            return state;
    }
};