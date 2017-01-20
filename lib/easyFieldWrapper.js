'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = 'src/easyFieldWrapper.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (WrappedComponent) {
    var _class, _temp2;

    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var parser = config.parser,
        validator = config.validator;

    var $validators = Object.assign({}, $defaultValidators, validator || {});

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
                $pending: false
                //$error: null,
                //$viewValue: '',
                //$modelValue: ''
            }, _this.parseValue = parser || function (refs) {
                var elem = _this.getElem(refs);

                var type = elem.type;
                return elem.nodeName.toUpperCase() == 'INPUT' && (type == 'radio' || type == 'checkbox') && !elem.checked ? null : elem.value;
            }, _this.initField = function (refs) {
                var elem = _this.getElem(refs);
                _this.refs = refs;

                _this.onChange();

                if (document.activeElement == elem) {
                    _this.onFocus();
                }
            }, _this.destroy = function () {
                if (_this.context.__easyformRender__) {
                    _this.context.__easyformRender__();
                }
            }, _this.onChange = function (e) {
                var value = _this.parseValue(_this.refs);
                var _this$state = _this.state,
                    $dirty = _this$state.$dirty,
                    $modelValue = _this$state.$modelValue;
                var _this$props = _this.props,
                    onChange = _this$props.onChange,
                    __onChange__ = _this$props.__onChange__;

                var state = _this.validate(value);

                var target = e && e.target;
                var type = e && e.type;

                var confirmField = _this.props.confirm || _this.props.confirmed;

                var triggerOnChange = function triggerOnChange() {
                    if (e && onChange && !_this.checkEqual($modelValue, state.$modelValue)) {
                        onChange({
                            target: target, type: type
                        });
                    }

                    //confirm验证
                    if (e && confirmField) {
                        confirmField.onChange();
                    }
                };

                if (e && 'stopPropagation' in e) {
                    e.stopPropagation();
                }

                _this.triggerState(Object.assign({}, state, {
                    $dirty: $dirty || !!e
                })).then(triggerOnChange);

                if (e && __onChange__) {
                    __onChange__(e);
                }
            }, _this.onFocus = function (e) {
                var onFocus = _this.props.onFocus;


                _this.triggerState({
                    $focusing: true,
                    $touched: true
                }).then(function () {
                    return e && onFocus && onFocus(e);
                });
            }, _this.onBlur = function (e) {
                var onBlur = _this.props.onBlur;


                _this.triggerState({
                    $focusing: false
                }).then(function () {
                    return e && onBlur && onBlur(e);
                });
            }, _temp), _possibleConstructorReturn(_this, _ret);
        }

        _createClass(FieldWrapper, [{
            key: 'getElem',
            value: function getElem(refs) {
                for (var name in refs) {
                    if (refs.hasOwnProperty(name)) {
                        var ref = refs[name];
                        return ref.state ? this.getElem(ref.refs) : ref;
                    }
                }
            }
        }, {
            key: 'checkEqual',
            value: function checkEqual(oldV, newV) {
                var isRadio = this.getElem(this.refs).type == 'radio';

                return !isRadio && oldV === newV;
            }

            /**
             * 用户输入处理
             *
             */


            /**
             * 输入框获得焦点处理
             *
             */


            /**
             * 输入框失去焦点处理
             *
             */

        }, {
            key: 'validate',


            //验证器，返回state对象
            value: function validate(value) {
                var _this2 = this;

                var $invalid = false,
                    $error = {},
                    props = this.props,
                    $pending = !!props.asyncValidator;

                var _state = this.state,
                    $dirty = _state.$dirty,
                    $touched = _state.$touched;

                var validMessage = props.validMessage || {};

                (0, _each2.default)($validators, function (validator, name) {
                    if ((value || name == 'required') && props[name] && !validator(value, props[name])) {
                        $error[name] = validMessage[name] || '请检查输入';
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
                                    asyncValidator: validMessage.asyncValidator || e.message
                                }
                            };
                        }).then(function (state) {
                            //确保返回结果对应的是当前输入
                            if (_this2.parseValue(_this2.refs) == value) {
                                _this2.triggerState(Object.assign({}, state, {
                                    $pending: false
                                }));
                            }
                        });
                    } catch (e) {
                        console.error(e);
                    }

                    $error = { asyncValidator: '正在验证...' };
                }

                return {
                    $dirty: $dirty,
                    $touched: $touched,
                    $invalid: $invalid,
                    $pending: $pending,
                    $valid: !$invalid,
                    $error: $invalid || $pending ? $error : null,

                    $viewValue: value,
                    $modelValue: $invalid ? null : value
                };
            }
        }, {
            key: 'triggerState',
            value: function triggerState(state) {
                var _this3 = this;

                return new Promise(function (resolve) {
                    return _this3.setState(state, function () {
                        if (_this3.context.__easyformRender__) {
                            _this3.context.__easyformRender__().then(resolve);
                        } else {
                            resolve();
                        }
                    });
                });
            }
        }, {
            key: 'getErrorMsg',
            value: function getErrorMsg(errKey) {
                var validMessage = this.props.validMessage || {};
                return validMessage[errKey] || '请检查输入';
            }

            /**
             * 设置验证状态
             * @param {string} key 错误key
             * @param {bool} 结果，true表示
             */

        }, {
            key: 'setValidity',
            value: function setValidity(validationErrorKey, isValid) {
                var _state2 = this.state,
                    $invalid = _state2.$invalid,
                    $error = _state2.$error;


                if ($error) {
                    delete $error[validationErrorKey];
                }

                var $newInvalid = Object.keys($error || {}).length > 0 || !isValid;

                this.triggerState({
                    $invalid: $newInvalid,
                    $valid: !$newInvalid,
                    $error: $newInvalid ? Object.assign({}, $error, isValid ? {} : _defineProperty({}, validationErrorKey, this.getErrorMsg(validationErrorKey))) : null
                });
            }
        }, {
            key: 'render',
            value: function render() {
                return _react2.default.createElement(WrappedComponent, Object.assign({}, this.props, this.context, { easyfield: this.state || {}, onChange: this.onChange, onFocus: this.onFocus, onBlur: this.onBlur, __init__: this.initField, __destroy__: this.destroy, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 241
                    },
                    __self: this
                }));
            }
        }]);

        return FieldWrapper;
    }(_react.Component), _class.propTypes = {
        validMessage: _react.PropTypes.object,
        pattern: _react.PropTypes.oneOfType([_react.PropTypes.func, _react.PropTypes.instanceOf(RegExp)])
    }, _class.contextTypes = {
        __easyformRender__: _react.PropTypes.func,
        __errorLevel__: _react.PropTypes.number
    }, _temp2;
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var $defaultValidators = {
    required: function required(value) {
        return value != null && value.length > 0;
    },
    pattern: function pattern(value, _pattern) {
        return !_pattern || (typeof _pattern == 'function' ? _pattern(value) : _pattern.test(value));
    },
    confirm: function confirm(value, confirmed) {
        return !confirmed.state.$viewValue || value == confirmed.state.$viewValue;
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
};