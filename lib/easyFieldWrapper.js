'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (WrappedComponent) {
    var _class, _temp2;

    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return _temp2 = _class = function (_Component) {
        _inherits(FieldWrapper, _Component);

        function FieldWrapper() {
            var _ref;

            var _temp, _this, _ret;

            _classCallCheck(this, FieldWrapper);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FieldWrapper.__proto__ || Object.getPrototypeOf(FieldWrapper)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
                $valid: true,
                $invalid: false,
                $dirty: false,
                $touched: false,
                $focusing: false,
                $pending: false,
                $error: null,
                $viewValue: null,
                $modelValue: null
            }, _this.validatorHandlers = {
                required: function required(value) {
                    return !!value && value.length > 0;
                },
                pattern: function pattern(value, _pattern) {
                    return !_pattern || (typeof _pattern === 'function' ? _pattern(value) : _pattern.test(value));
                },
                confirm: function confirm(value, confirmed) {
                    return !confirmed || value === confirmed;
                },
                minLength: function minLength(value, length) {
                    return value.length >= parseInt(length);
                },
                maxLength: function maxLength(value, length) {
                    return value.length <= parseInt(length);
                },
                min: function min(value, minValue) {
                    return parseFloat(value) >= parseFloat(minValue);
                },
                max: function max(value, maxValue) {
                    return parseFloat(value) <= parseFloat(maxValue);
                }
            }, _this.refCallback = function (input) {
                _this.$input = input;
                if (!_this.props.groupField && _this.props.name) {
                    _this.context.$$register(_this.props.name, input && _this);
                }

                if (input) {
                    if (typeof input.getValue !== 'function') {
                        throw new Error('The FieldWrappedComponent class must have a method named "getValue".');
                    }

                    _this.getInputValue = input.getValue;

                    //设置初始state
                    _this.updateState();
                } else {
                    _this.context.$$render();
                }
            }, _this.handleEvent = function (_ev, typeName) {
                var ev = {
                    type: typeName || _ev.type,
                    target: _ev.target
                };

                (function () {
                    switch (ev.type) {
                        case 'change':
                            var onChange = _this.props.onChange;


                            if (_this.props['data-groupfield']) {
                                onChange && onChange(ev);
                            } else {
                                (function () {
                                    var value = _this.getInputValue();
                                    var $modelValue = _this.state.$modelValue;


                                    var newState = _this.getNewState(value);

                                    _this.handleState(Object.assign({}, newState, {
                                        $dirty: true
                                    })).then(function () {
                                        if (_this.isEqual($modelValue, newState.$modelValue) === false) {
                                            onChange && onChange(ev);
                                        }

                                        //confirmed
                                        var confirmedName = _this.props.confirm || _this.props.confirmed;
                                        if (confirmedName && _this.context.$$getControl(confirmedName)) {
                                            _this.context.$$getControl(confirmedName).updateState();
                                        }
                                    });
                                })();
                            }

                            break;
                        case 'focus':
                        case 'blur':
                            var isFocus = ev.type == 'focus';
                            var handler = _this.props[ev.type == 'focus' ? 'onFocus' : 'onBlur'];
                            if (_this.props['data-groupfield']) {
                                handler && handler(ev);
                            } else {
                                _this.handleState({
                                    $focusing: isFocus,
                                    $touched: _this.state.$touched || isFocus
                                }).then(function () {
                                    handler && handler(ev);
                                });
                            }

                            break;
                        default:
                            break;
                    }
                })();
            }, _this.setValidity = function (validationErrorKey, isValid) {
                var $error = _this.state.$error;


                if ($error) {
                    delete $error[validationErrorKey];
                }

                var $newInvalid = Object.keys($error || {}).length > 0 || !isValid;

                _this.handleState({
                    $invalid: $newInvalid,
                    $valid: !$newInvalid,
                    $error: $newInvalid ? Object.assign({}, $error, isValid ? {} : _defineProperty({}, validationErrorKey, _this.getErrorMsg(validationErrorKey))) : null
                });
            }, _temp), _possibleConstructorReturn(_this, _ret);
        }

        /**
         * 节点引用回调
         */


        _createClass(FieldWrapper, [{
            key: 'isEqual',
            value: function isEqual(oldValue, newValue) {
                var isRadio = this.props.type == 'radio';

                return !isRadio && oldValue === newValue;
            }

            /**
             * 事件处理
             * @param {String} type 事件名称
             */

        }, {
            key: 'updateState',
            value: function updateState() {
                this.handleState(this.getNewState(this.getInputValue()));
            }
        }, {
            key: 'getNewState',
            value: function getNewState(value) {
                var _this2 = this;

                var props = this.props;

                var $error = {},
                    $invalid = false,
                    $pending = !!props.asyncValidator;

                (0, _each2.default)(this.validatorHandlers, function (checker, type) {
                    var propValue = type == 'confirm' ? _this2.context.$$getControl(props[type]) && _this2.context.$$getControl(props[type]).state.$modelValue : props[type];

                    if ((name === 'required' || !$error.required) && propValue != null && checker(value, propValue) === false) {
                        $error[type] = _this2.getErrorMsg(type);
                        $invalid = true;
                    }
                });

                if ($pending && !$invalid) {
                    try {
                        props.asyncValidator(value).then(function () {
                            return {
                                $invalid: false,
                                $error: null
                            };
                        }).catch(function (e) {
                            return {
                                $invalid: true,
                                $error: {
                                    asyncValidator: _this2.getErrorMsg('asyncValidator', e.message)
                                }
                            };
                        }).then(function (state) {
                            //确保返回结果对应的是当前输入
                            if (_this2.getInputValue() === value) {
                                _this2.handleState(Object.assign({}, state, {
                                    $pending: false
                                }));
                            }
                        });
                    } catch (e) {
                        console.error(e);
                    }

                    $error = { asyncValidator: this.context.$$config.defaultPendingMsg };
                }

                return {
                    $invalid: $invalid,
                    $pending: $pending,
                    $valid: !$invalid,
                    $error: $invalid || $pending ? $error : null,

                    $viewValue: value,
                    $modelValue: $invalid ? null : value
                };
            }

            /**
             * 设置新state，返回promise，表单render后触发resolve
             * @param {Object} newState 新的状态对象
             *
             * @return {Promise}
             */

        }, {
            key: 'handleState',
            value: function handleState(newState) {
                var _this3 = this;

                if (!this.isUnmount) {
                    return new Promise(function (resolve) {
                        return _this3.setState(newState, function () {
                            if (_this3.context.$$render) {
                                _this3.context.$$render().then(resolve);
                            } else {
                                resolve();
                            }
                        });
                    });
                }
            }
        }, {
            key: 'getErrorMsg',
            value: function getErrorMsg(errKey, errMsg) {
                var validMessage = this.props.validMessage || {};
                return validMessage[errKey] || errMsg || this.context.$$config.defaultErrorMsg;
            }

            /**
            * 设置验证状态
            * @param {string} key 错误key
            * @param {bool} 结果，true表示
            */

        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this.isUnmount = true;
            }
        }, {
            key: 'render',
            value: function render() {
                var myProps = {
                    ref: this.refCallback,
                    $trigger: this.handleEvent,
                    $errorLevel: this.context.$$config.errorLevel,
                    easyfield: this.state || {}
                };
                return _react2.default.createElement(WrappedComponent, Object.assign({}, this.props, myProps));
            }
        }]);

        return FieldWrapper;
    }(_react.Component), _class.propTypes = {
        validMessage: _propTypes2.default.object,
        pattern: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.instanceOf(RegExp)])
    }, _class.contextTypes = {
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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }