'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (WrappedComponent) {
    var _class, _temp2;

    var errorLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

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
                easyform: new EasyForm(),
                params: {}
            }, _this.latestUpdateTime = 0, _this.INTERVAL = 20, _this.formUpdate = function () {
                var now = Date.now();

                return _this.renderHandlerPromise || (_this.renderHandlerPromise = new Promise(function (resolve) {
                    setTimeout(function () {
                        if (_this.isUnmount) {
                            return;
                        }

                        _this.latestUpdateTime = Date.now();
                        delete _this.renderHandlerPromise;

                        var easyform = _this.state.easyform.update();
                        _this.setState({
                            easyform: easyform,
                            params: easyform.params
                        }, function () {
                            //如果是嵌套的表单，需要主动触发父级表单render
                            if (_this.context.__easyformRender__) {
                                _this.context.__easyformRender__().then(resolve);
                            } else {
                                resolve();
                            }
                        });
                    }, Math.max(0, _this.INTERVAL - now + _this.latestUpdateTime));
                }));
            }, _temp), _possibleConstructorReturn(_this, _ret);
        }

        _createClass(FormWrapper, [{
            key: 'getChildContext',
            value: function getChildContext() {
                return {
                    __easyformRender__: this.formUpdate,
                    __errorLevel__: errorLevel
                };
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
                this.isUnmount = true;
            }
        }, {
            key: 'render',
            value: function render() {
                return _react2.default.createElement(WrappedComponent, Object.assign({}, this.props, this.state));
            }
        }]);

        return FormWrapper;
    }(_react.Component), _class.contextTypes = {
        __easyformRender__: _react.PropTypes.func
    }, _class.childContextTypes = {
        __easyformRender__: _react.PropTypes.func,
        __errorLevel__: _react.PropTypes.number
    }, _temp2;
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EasyForm = function () {
    function EasyForm() {
        _classCallCheck(this, EasyForm);

        this.$valid = true;
        this.$invalid = false;
        this.$dirty = false;
        this.$touched = false;
        this.params = {};
        this.refs = {};

        this.stateRefs = {};
    }

    _createClass(EasyForm, [{
        key: 'init',
        value: function init(refs) {
            this.refs = refs;
        }
    }, {
        key: 'update',
        value: function update() {
            var errors = {};
            var params = {};
            var $invalid = false;
            var $touched = false;
            var $dirty = false;
            var stateRefs = {};

            var handler = function handler(refs) {
                (0, _each2.default)(refs, function (ref, name) {
                    var state = ref.state || {};

                    //这里循环处理下，遇到子easyform组件时
                    if (state.easyform) {
                        handler(state.easyform.refs);
                    } else {
                        params[name] = ref.state ? state.$modelValue : ref.value;

                        if (state.$invalid) {
                            errors[name] = state.$error;
                        }

                        $invalid = $invalid || state.$invalid;
                        $touched = $touched || state.touched;
                        $dirty = $dirty || state.$dirty;

                        stateRefs[name] = state;
                    }
                });
            };

            handler(this.refs);

            this.params = params;
            this.$error = $invalid ? errors : null;
            this.$valid = !$invalid;
            this.$invalid = $invalid;
            this.$dirty = $dirty;
            this.$touched = $touched;

            this.stateRefs = stateRefs;

            return this;
        }
    }, {
        key: 'get',
        value: function get(name) {
            return this.stateRefs[name] || {};
        }
    }]);

    return EasyForm;
}();