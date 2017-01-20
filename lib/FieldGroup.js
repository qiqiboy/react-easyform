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

var _toArray = require('lodash/toArray');

var _toArray2 = _interopRequireDefault(_toArray);

var _classlist = require('./classlist');

var _classlist2 = _interopRequireDefault(_classlist);

var _filterProps = require('./filterProps');

var _filterProps2 = _interopRequireDefault(_filterProps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = FieldGroup.__proto__ || Object.getPrototypeOf(FieldGroup)).call.apply(_ref, [this].concat(args))), _this), _this.onChange = function (e) {
            var checkedInputs = (0, _toArray2.default)(_this.$input.querySelectorAll('[name=' + _this.props.name + ']')).filter(function (input) {
                return input.checked;
            });
            var value = _this.props.type == 'checkbox' ? checkedInputs.map(function (input) {
                return input.value;
            }) : e.target.value;

            _this.$input.value = value;

            //触发FieldWrapper
            _this.props.onChange(e);
        }, _this.onFocus = function (e) {
            _this.props.onFocus(e);
        }, _this.onBlur = function (e) {
            _this.props.onBlur(e);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(FieldGroup, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var defaultValue = this.props.defaultValue;

            if (this.props.type == 'checkbox' && defaultValue != null && !Array.isArray(defaultValue)) {
                defaultValue = [defaultValue];
            }

            this.$input.value = defaultValue;

            this.props.__init__(this.$input);
        }
    }, {
        key: 'getChecked',
        value: function getChecked(value) {
            var type = this.props.type;
            var $viewValue = this.props.easyfield.$viewValue;

            if (type == 'radio') {
                return {
                    checked: $viewValue == value
                };
            }

            if (type == 'checkbox') {
                return {
                    checked: Array.isArray($viewValue) ? !!$viewValue.find(function (item) {
                        return value == item;
                    }) : false
                };
            }

            return {};
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var myProps = _omit2.default.apply(undefined, [this.props, 'onChange', 'onFocus', 'onBlur'].concat(_toConsumableArray(_filterProps2.default)));
            var _props = this.props,
                name = _props.name,
                type = _props.type,
                className = _props.className,
                noError = _props.noError;
            var __errorLevel__ = this.props.__errorLevel__;
            var _props$easyfield = this.props.easyfield,
                $error = _props$easyfield.$error,
                $dirty = _props$easyfield.$dirty,
                $invalid = _props$easyfield.$invalid,
                $touched = _props$easyfield.$touched,
                $focusing = _props$easyfield.$focusing,
                $modelValue = _props$easyfield.$modelValue;

            var children = _react.Children.map(this.props.children, function (elem, index) {
                return (0, _react.cloneElement)(elem, Object.assign({
                    name: name, type: type,
                    key: elem.key || index,
                    __onChange__: _this2.onChange,
                    __onFocus__: _this2.onFocus,
                    __onBlur__: _this2.onBlur
                }, _this2.getChecked(elem.props.value)));
            });

            var classes = {
                'form-group-control': true,
                'ef-dirty': $dirty,
                'ef-valid': !$invalid,
                'ef-invalid': $invalid,
                'ef-touched': $touched,
                'ef-focusing': $focusing
            };

            myProps.ref = function (input) {
                return _this2.$input = input;
            };

            //添加对应的错误的classname
            if ($error) {
                Object.keys($error).forEach(function (name) {
                    return classes['ef-error-' + name] = true;
                });
            }

            myProps.className = (className ? className + ' ' : '') + (0, _classlist2.default)(classes);

            return _react2.default.createElement(
                'div',
                myProps,
                children,
                $error && !noError && __errorLevel__ && (__errorLevel__ == 1 && $focusing || __errorLevel__ == 2 && $dirty || __errorLevel__ == 3) ? _react2.default.createElement(
                    'div',
                    { className: 'ef-error-tip' },
                    (0, _values2.default)($error)[0]
                ) : null
            );
        }
    }]);

    return FieldGroup;
}(_react.PureComponent);

FieldGroup.defaultProps = {
    className: 'form-inline'
};
FieldGroup.propTypes = {
    name: _react.PropTypes.string.isRequired,
    type: _react.PropTypes.oneOf(["radio", "checkbox"]).isRequired
};
exports.default = (0, _easyFieldWrapper2.default)(FieldGroup);