'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _jsxFileName = 'src/Field.jsx';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _easyFieldWrapper = require('./easyFieldWrapper');

var _easyFieldWrapper2 = _interopRequireDefault(_easyFieldWrapper);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _values = require('lodash/values');

var _values2 = _interopRequireDefault(_values);

var _classlist = require('./classlist');

var _classlist2 = _interopRequireDefault(_classlist);

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
        _classCallCheck(this, Field);

        return _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).apply(this, arguments));
    }

    _createClass(Field, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.__init__(this.refs);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.props.__destroy__();
        }
    }, {
        key: 'renderByType',
        value: function renderByType(myProps, children) {
            switch (myProps.type) {
                case 'select':
                    return _react2.default.createElement(
                        'select',
                        Object.assign({}, myProps, {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 24
                            },
                            __self: this
                        }),
                        children
                    );
                case 'radio':
                case 'checkbox':
                    return _react2.default.createElement(
                        'label',
                        {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 27
                            },
                            __self: this
                        },
                        _react2.default.createElement('input', Object.assign({}, myProps, {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 27
                            },
                            __self: this
                        })),
                        myProps.label
                    );
                default:
                    return _react2.default.createElement('input', Object.assign({}, myProps, {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 29
                        },
                        __self: this
                    }));
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var myProps = _omit2.default.apply(undefined, [this.props].concat(_toConsumableArray(_filterProps2.default)));
            var _props$easyfield = this.props.easyfield,
                $error = _props$easyfield.$error,
                $dirty = _props$easyfield.$dirty,
                $focusing = _props$easyfield.$focusing,
                $invalid = _props$easyfield.$invalid,
                $touched = _props$easyfield.$touched;
            var _props = this.props,
                className = _props.className,
                noError = _props.noError;
            var __errorLevel__ = this.props.__errorLevel__;

            var classes = {
                'form-control': myProps.type != 'radio' && myProps.type != 'checkbox',
                'ef-dirty': $dirty,
                'ef-valid': !$invalid,
                'ef-invalid': $invalid,
                'ef-touched': $touched,
                'ef-focusing': $focusing
            };

            myProps.ref = 'input';

            //添加对应的错误的classname
            if ($error) {
                Object.keys($error).forEach(function (name) {
                    return classes['ef-error-' + name] = true;
                });
            }

            myProps.className = (0, _classlist2.default)(classes);

            return _react2.default.createElement(
                'div',
                { className: (className ? className + ' ' : '') + (0, _classlist2.default)({ 'form-group': true, 'has-error': $invalid }), __source: {
                        fileName: _jsxFileName,
                        lineNumber: 57
                    },
                    __self: this
                },
                this.renderByType(myProps, this.props.children),
                myProps.type != 'select' ? this.props.children : null,
                $error && !noError && __errorLevel__ && (__errorLevel__ == 1 && $focusing || __errorLevel__ == 2 && $dirty || __errorLevel__ == 3) ? _react2.default.createElement(
                    'div',
                    { className: 'ef-error-tip', __source: {
                            fileName: _jsxFileName,
                            lineNumber: 62
                        },
                        __self: this
                    },
                    (0, _values2.default)($error)[0]
                ) : null
            );
        }
    }]);

    return Field;
}(_react.Component);

Field.defaultProps = {
    type: 'text'
};
exports.default = (0, _easyFieldWrapper2.default)(Field);