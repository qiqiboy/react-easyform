'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _easyFieldWrapper = require('./easyFieldWrapper');

var _easyFieldWrapper2 = _interopRequireDefault(_easyFieldWrapper);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _values = require('lodash/values');

var _values2 = _interopRequireDefault(_values);

var _filterProps = require('./filterProps');

var _filterProps2 = _interopRequireDefault(_filterProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Field = function (_Component) {
    _inherits(Field, _Component);

    function Field() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Field);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Field.__proto__ || Object.getPrototypeOf(Field)).call.apply(_ref, [this].concat(args))), _this), _this.refCallback = function (input) {
            _this.$input = input;
        }, _this.getValue = function () {
            var type = _this.props.type,
                $input = _this.$input;


            if ($input.nodeName && $input.nodeName.toUpperCase() == 'INPUT' && (type == 'radio' || type == 'checkbox') && !$input.checked) {
                return null;
            }

            return _this.$input.value.trim();
        }, _this.onChange = function (ev) {
            return _this.props.$trigger(ev, 'change');
        }, _this.onFocus = function (ev) {
            return _this.props.$trigger(ev, 'focus');
        }, _this.onBlur = function (ev) {
            return _this.props.$trigger(ev, 'blur');
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Field, [{
        key: 'renderByType',
        value: function renderByType(props, children) {
            switch (props.type) {
                case 'select':
                    return _react2.default.createElement(
                        'select',
                        props,
                        children
                    );
                case 'radio':
                case 'checkbox':
                    return _react2.default.createElement(
                        'label',
                        null,
                        _react2.default.createElement('input', props),
                        props.label
                    );
                case 'textarea':
                    return _react2.default.createElement('textarea', props);
                default:
                    return _react2.default.createElement('input', props);
            }
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

            var optionsChildren = []; //提取select项的option子节点
            var children = [];

            var _props = this.props,
                $errorLevel = _props.$errorLevel,
                className = _props.className,
                noError = _props.noError,
                type = _props.type;
            var _props$easyfield = this.props.easyfield,
                $error = _props$easyfield.$error,
                $invalid = _props$easyfield.$invalid,
                $focusing = _props$easyfield.$focusing,
                $dirty = _props$easyfield.$dirty;


            var classes = [];
            var groupClasses = ['form-group'];

            if (type != 'checkbox' && type != 'radio') {
                classes.push('form-control');
            }

            "dirty valid invalid touched focusing pending".split(" ").forEach(function (name) {
                if (_this2.props.easyfield['$' + name]) {
                    classes.push('ef-' + name);
                }
            });

            _react.Children.forEach(this.props.children, function (elem) {
                elem.type == 'option' ? optionsChildren.push(elem) : children.push(elem);
            });

            var myProps = Object.assign({}, _omit2.default.apply(undefined, [this.props].concat(_toConsumableArray(_filterProps2.default))), {
                ref: this.refCallback,
                onChange: this.onChange,
                onFocus: this.onFocus,
                onBlur: this.onBlur,
                className: Object.keys($error || {}).map(function (name) {
                    return 'ef-error-' + name;
                }).concat(classes).join(' ')
            });

            if (className) {
                groupClasses.push(className);
            }

            if ($invalid) {
                groupClasses.push('has-ef-error');
            }

            return _react2.default.createElement(
                'div',
                { className: groupClasses.join(' ') },
                this.renderByType(myProps, optionsChildren),
                children,
                $error && !noError && $errorLevel && ($errorLevel == 1 && $focusing || $errorLevel == 2 && $dirty || $errorLevel == 3) ? _react2.default.createElement(
                    'div',
                    { className: 'ef-error-tip' },
                    (0, _values2.default)($error)[0]
                ) : null
            );
        }
    }]);

    return Field;
}(_react.PureComponent);

Field.defaultProps = {
    type: 'text'
};
exports.default = (0, _easyFieldWrapper2.default)(Field);