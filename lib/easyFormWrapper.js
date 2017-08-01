'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (WrappedComponent) {
    var _class, _temp2;

    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    config = Object.assign({
        errorLevel: 1,
        defaultErrorMsg: 'Your input is incorrect.',
        defaultPendingMsg: 'Waiting...'
    }, config);

    /*!
     * @param {Number} errorLeve
     *    0: 关闭错误
     *    1: focus时显示
     *    2: 总是显示错误
     *
     *    默认是1
     */
    return _temp2 = _class = function (_Component) {
        _inherits(FormWrapper, _Component);

        function FormWrapper() {
            var _ref;

            var _temp, _this, _ret;

            _classCallCheck(this, FormWrapper);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FormWrapper.__proto__ || Object.getPrototypeOf(FormWrapper)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
                $valid: true,
                $invalid: false,
                $dirty: false,
                $touched: false,
                $focusing: false,
                $error: null,
                stateRefs: {},
                params: {}
            }, _this.latestUpdateTime = 0, _this.INTERVAL = 20, _this.formControls = {}, _this.formId = formId++, _this.register = function (name, input) {
                if (input) {
                    _this.formControls[name] = input;
                } else {
                    delete _this.formControls[name];
                }
            }, _this.refCallback = function (input) {
                input && _this.state.easyform.init(_this.formControls);
            }, _this.formUpdate = function () {
                var times = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

                var now = Date.now();

                return _this.renderHandlerPromise || (_this.renderHandlerPromise = new Promise(function (resolve) {
                    setTimeout(function () {
                        if (_this.isUnmount) {
                            return;
                        }

                        _this.latestUpdateTime = Date.now();
                        delete _this.renderHandlerPromise;

                        _this.setState(_this.getNewState(), function () {
                            //如果是嵌套的表单，需要主动触发父级表单render
                            if (_this.context.$$render && _this.props.name) {
                                _this.context.$$render().then(resolve);
                            } else {
                                resolve();
                            }
                        });
                    }, Math.max(0, _this.INTERVAL - now + _this.latestUpdateTime));
                })).then(function () {
                    if (_this.isEqualState(_this.getNewState(), _this.state) === false && times < 10) {
                        _this.formUpdate(++times);
                    }
                });
            }, _this.refCallback = function (input) {
                return _this.props.name && _this.context.$$register && _this.context.$$register(_this.props.name, _this);
            }, _temp), _possibleConstructorReturn(_this, _ret);
        }

        _createClass(FormWrapper, [{
            key: 'getChildContext',
            value: function getChildContext() {
                var _this2 = this;

                return {
                    $$render: this.formUpdate,
                    $$register: this.register,
                    $$config: config,
                    $$getControl: function $$getControl(name) {
                        return _this2.formControls[name];
                    }
                };
            }

            /**
             * 注册表单项
             * @param {String} name 表单项名字
             * @param {Element} input 表单项
             */

        }, {
            key: 'isEqualState',
            value: function isEqualState(newState, oldState) {
                if (newState === oldState) {
                    return true;
                }

                if ((typeof newState === 'undefined' ? 'undefined' : _typeof(newState)) === 'object' && (typeof oldState === 'undefined' ? 'undefined' : _typeof(oldState)) === 'object') {
                    //键值数量不一致
                    if (Object.keys(newState).length !== Object.keys(oldState).length) {
                        return false;
                    }

                    for (var key in oldState) {
                        if (oldState.hasOwnProperty(key)) {
                            var oldValue = oldState[key];
                            var newValue = newState[key];

                            if (this.isEqualState(newValue, oldValue) === false) {
                                return false;
                            }
                        }
                    }

                    return true;
                }

                return false;
            }
        }, {
            key: 'getNewState',
            value: function getNewState() {
                var params = {},
                    error = {},
                    stateRefs = {},
                    $invalid = false,
                    $touched = false,
                    $focusing = false,
                    $dirty = false;

                var newState = {
                    params: params,
                    stateRefs: stateRefs
                };

                var process = function process(refs) {
                    (0, _each2.default)(refs, function (ref, name) {
                        if (ref.formControls) {
                            process(ref.formControls);
                        } else if (!ref.$input.props.disabled) {
                            var state = ref.state || {};
                            params[name] = state.$modelValue;

                            if (state.$invalid) {
                                error[name] = state.$error;
                            }

                            $invalid = state.$invalid || $invalid;
                            $touched = state.touched || $touched;
                            $focusing = state.$focusing || $focusing;
                            $dirty = state.$dirty || $dirty;

                            stateRefs[name] = state;
                        }
                    });
                };

                process(this.formControls);

                newState.$error = $invalid ? error : null;
                newState.$valid = !$invalid;
                newState.$invalid = $invalid;
                newState.$dirty = $dirty;
                newState.$focusing = $focusing;
                newState.$touched = $touched;

                return newState;
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this.isUnmount = true;
            }
        }, {
            key: 'render',
            value: function render() {
                var _this3 = this;

                var easyform = Object.assign({}, this.state, {
                    get: function get(name) {
                        return _this3.state.stateRefs[name] || {};
                    }
                });

                return _react2.default.createElement(WrappedComponent, Object.assign({}, this.props, { easyform: easyform, params: this.state.params, ref: this.refCallback }));
            }
        }]);

        return FormWrapper;
    }(_react.Component), _class.contextTypes = {
        $$render: _propTypes2.default.func,
        $$register: _propTypes2.default.func
    }, _class.childContextTypes = {
        $$render: _propTypes2.default.func,
        $$register: _propTypes2.default.func,
        $$config: _propTypes2.default.object,
        $$getControl: _propTypes2.default.func
    }, _temp2;
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var formId = 0;