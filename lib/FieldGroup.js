'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _easyFieldWrapper = require('./easyFieldWrapper');

var _easyFieldWrapper2 = _interopRequireDefault(_easyFieldWrapper);

var _values = require('lodash/values');

var _values2 = _interopRequireDefault(_values);

var _find = require('lodash/find');

var _find2 = _interopRequireDefault(_find);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FieldGroup = function (_Component) {
    _inherits(FieldGroup, _Component);

    function FieldGroup() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, FieldGroup);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FieldGroup.__proto__ || Object.getPrototypeOf(FieldGroup)).call.apply(_ref, [this].concat(args))), _this), _this.onChange = function (ev) {
            return _this.props.$trigger(ev, 'change');
        }, _this.onFocus = function (ev) {
            return _this.props.$trigger(ev, 'focus');
        }, _this.onBlur = function (ev) {
            return _this.props.$trigger(ev, 'blur');
        }, _this.refCallback = function (input) {
            _this.$input = input;
        }, _this.getValue = function () {
            if (!_this.$input) {
                return _this.props.defaultValue;
            }

            var inputs = _this.$input.querySelectorAll('[name=' + _this.props.name + ']');
            var checkedInputs = [].filter.call(inputs, function (input) {
                return input.checked;
            });

            return _this.props.type == 'checkbox' ? checkedInputs.map(function (input) {
                return input.value;
            }) : checkedInputs.length ? checkedInputs[0].value : null;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(FieldGroup, [{
        key: 'getChecked',
        value: function getChecked(value) {
            var type = this.props.type;

            var $viewValue = this.getValue();

            if (type == 'radio') {
                return {
                    checked: $viewValue == value
                };
            }

            if (type == 'checkbox') {
                return {
                    checked: Array.isArray($viewValue) ? !!(0, _find2.default)($viewValue, function (item) {
                        return value == item;
                    }) : false
                };
            }

            return {};
        }

        /**
         * ref节点引用回调
         */


        /**
         * 供fieldWrapper调用的获取输入项值的方法
         * 如果是自定义表单组件，也需要提供该方法以确保filedwrapper可以正确获取到值
         */

    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                $errorLevel = _props.$errorLevel,
                className = _props.className,
                noError = _props.noError,
                type = _props.type,
                name = _props.name;
            var _props$easyfield = this.props.easyfield,
                $error = _props$easyfield.$error,
                $invalid = _props$easyfield.$invalid,
                $focusing = _props$easyfield.$focusing,
                $dirty = _props$easyfield.$dirty;


            var classes = ['form-group-control'];

            "dirty valid invalid touched focusing pending".split(" ").forEach(function (name) {
                if (_this2.props.easyfield['$' + name]) {
                    classes.push('ef-' + name);
                }
            });

            if (className) {
                classes.push(className);
            }

            if ($invalid) {
                classes.push('has-ef-error');
            }

            var children = _react.Children.map(this.props.children, function (elem, index) {
                return (0, _react.cloneElement)(elem, Object.assign({
                    name: name, type: type,
                    key: elem.key || index,
                    'data-groupField': true,
                    onChange: _this2.onChange,
                    onFocus: _this2.onFocus,
                    onBlur: _this2.onBlur
                }, _this2.getChecked(elem.props.value)));
            });

            var myProps = {
                ref: this.refCallback,
                className: Object.keys($error || {}).map(function (name) {
                    return 'ef-error-' + name;
                }).concat(classes).join(' ')
            };

            return _react2.default.createElement(
                'div',
                myProps,
                children,
                $error && !noError && $errorLevel && ($errorLevel == 1 && $focusing || $errorLevel == 2 && $dirty || $errorLevel == 3) ? _react2.default.createElement(
                    'div',
                    { className: 'ef-error-tip' },
                    (0, _values2.default)($error)[0]
                ) : null
            );
        }
    }]);

    return FieldGroup;
}(_react.PureComponent);

FieldGroup.propTypes = {
    name: _propTypes2.default.string.isRequired,
    type: _propTypes2.default.oneOf(["radio", "checkbox"]).isRequired
};
exports.default = (0, _easyFieldWrapper2.default)(FieldGroup);