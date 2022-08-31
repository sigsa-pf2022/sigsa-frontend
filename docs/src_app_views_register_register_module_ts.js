"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_views_register_register_module_ts"],{

/***/ 73779:
/*!***************************************************!*\
  !*** ./src/app/views/register/register.module.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RegisterModule": () => (/* binding */ RegisterModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 34929);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3184);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 36362);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 90587);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ 93819);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 52816);






const routes = [
    {
        path: '',
        children: [
            {
                path: 'personal-data',
                loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_views_register_services_register-form-data_service_ts-node_modules_date-fns_e-40580c"), __webpack_require__.e("src_app_views_register_personal-data_personal-data_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./personal-data/personal-data.module */ 12821)).then((m) => m.PersonalDataModule),
            },
            {
                path: 'user-data',
                loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_views_register_services_register-form-data_service_ts-node_modules_date-fns_e-40580c"), __webpack_require__.e("common"), __webpack_require__.e("src_app_views_register_user-data_user-data_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./user-data/user-data.module */ 64017)).then((m) => m.UserDataModule),
            },
        ],
    },
];
let RegisterModule = class RegisterModule {
};
RegisterModule = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormsModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__.ReactiveFormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.IonicModule,
            _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterModule.forChild(routes),
        ],
        declarations: [],
    })
], RegisterModule);



/***/ })

}]);
//# sourceMappingURL=src_app_views_register_register_module_ts.js.map