# react-easyform
A Higher Order Component to build form &amp;input, support validators.  
一个React高阶组件（HOC），用来方便的创建表单，支持各类表单验证，支持异步验证。

### 功能特色 & Features

* 使用简便，具有详细的表单校验辅助html类名（classname）显示
* 支持单选组、复选组表单
* 支持表单嵌套、组合
* 支持多种表单验证规则，自定义验证信息显示
* 支持异步验证
* 通过内置的表单easyFieldwrapper包装器，可以自由定义表单输入项，以支持easyform

### 预览

* [在线示例 & Demo](http://u.boy.im/react-easyform/)
* [完整代码示范](https://github.com/qiqiboy/react-easyform/blob/master/example/app/Form.jsx)

## 安装 & Installation

     npm install --save react-easyform

## 开始使用 & Getting started

* 登录表单示例
```javascript
    import React, { Component, PropTypes } from 'react';
    import EasyForm, { Field, FieldGroup } from 'react-easyform';

    class Form extends Component {
        componentDidMount() {
            /* 必须有，用来初始化表单项 */
            this.props.easyform.init(this.refs);
        }

        submit = ev => {
            alert('submit!');
        }

        render() {
            // 经过EasyForm包装的组件，props里会有一个params属性，包含所有的表单项值
            const { params } = this.props.params;
            /*
             * props里的easyform对象，包含了一组验证结果，
             * 其中$invalid/$valid 可以用来判断表单项是够已经正确填写
             */
            const {$invalid} = this.props.easyform.$invalid;

            return (
                <form className="" onSubmit={this.submit} >
                    <Field type="text" ref="username" required pattern={/^[\w]{5,10}$/} 
                        validMessage={{required: '请填写用户名', pattern: '用户名不能包含字母数字下划线以外的字符'}} />
                    <Field type="text" ref="password" required validMessage={{required: '请填写密码'}} />
                    <button className="btn-submit" disabled={$invalid ? 'disabled' : false}>提交</button>
                </form>
            );
        }
    }

    export default EasyForm(Form);
```
* 单选、复选、下拉等示例
```javascript
    import React, {  Component, PropTypes } from 'react';
    import EasyForm, { Field, FieldGroup } from 'react-easyform';

    class Form extends Component {
        componentDidMount() {
            /* 必须有，用来初始化表单项 */
            this.props.easyform.init(this.refs);
        }

        submit = ev => {
            alert('submit!');
        }

        render() {
            // 经过EasyForm包装的组件，props里会有一个params属性，包含所有的表单项值
            const { params } = this.props.params;
            /*
             * props里的easyform对象，包含了一组验证结果，
             * 其中$invalid/$valid 可以用来判断表单项是够已经正确填写
             */
            const {$invalid} = this.props.easyform.$invalid;

            return (
                <form className="" onSubmit={this.submit} >
                    <div>性别</div>
                    <FieldGroup type="radio" ref="sex" required 
                        validMessage={{required: '请选择性别'}}>
                        <Field label="男" value="0" />
                        <Field label="女" value="1" />
                    </FieldGroup>
                    <FieldGroup type="checkbox" ref="hobbies" required minLength="2"
                        validMessage={{required: '请选择你的爱好', minLength: '至少选择两个爱好'}}>
                        <Field label="篮球" value="0" />
                        <Field label="足球" value="1" />
                        <Field label="乒乓球" value="2" />
                        <Field label="羽毛球" value="3" />
                    </FieldGroup>
                    <button className="btn-submit" disabled={$invalid ? 'disabled' : false}>提交</button>
                </form>
            );
        }
    }

    export default EasyForm(Form);
```

## 文档API & Documention
* ### EasyForm {Function}
    高阶组件包装器，你的表单组件需要使用该方法包装后返回。

    ```javascript
    /**
     * EasyForm
     *
     * @param {Component} WrapperComponent 需要被包装的页面表单组件
     * @param {Number} errorLevel 错误显示级别，默认为1
     *     0: 关闭
     *     1: focus时显示
     *     2: dirty有改动时显示
     *     3: 总是显示
     * @return {HOC} 返回包装后的高阶组件
     */
    class MyFormContainer extends React.Component {
        //这里不能省略，这里是初始化easyform
        //init方法传入的值，是一个包含了对各个表单项节点的引用的map。最简单的就是直接传入 this.refs
        componentDidMount() {
            this.props.easyform.init(this.refs);
        }

        render() {
            return (
                <div></div>
            )
        }
    } 

    //导出时需要使用 EasyForm 包装下
    export default EasyForm(MyFormContainer, 1);
    ```

    返回的高阶组件，props里会被注入两个属性：
    * `easyform` EasyForm的表单实例，保存了验证结果、表单项值、每个表单项的引用等
    * `params` 一个快捷访问表单参数的对象（easyform对象下也有该值）
* ### Field {High Order React-Component}
    表单项高阶组件，支持React对form输入项节点的所有属性，例如`defaultValue` `type` `onChange`等；也支持各种事件绑定。
    
    ```html
        <Field type="password" placeholder="请输入密码" onChange={this.onChange} />
        <Field type="password" placeholder="请输入密码" onFocus={this.onFocus} defaultValue="12345" />
        <Field type="select" placeholder="请输入密码">
            <option value="">请选择</option>
            <option value="0">女</option>
            <option value="1">男</option>
        </Field>
        <Field type="radio" label="单选项描述这里传入" onChange={this.change} />
        <Field type="checkbox" label="复选项描述这里传入" onChange={this.change} />
    ```

    有几点需要注意：
    * 如果是单选或者复选，label必须通过属性 `label` 传入
    * 如果有默认值，要使用 `defaultValue` 传入，如果使用 `value` 也会导致组件成为一个受限组件（controlled components）
    * 下拉框，也要通过 Field 高阶组件创建，指定 `type="select"` 即可

    使用Field生成的节点，会包含一组easyform验证结果classname：
    ```html
        <div class="form-group">
            <input type="password" placeholder="请输入密码"
                class="form-control ef-valid ef-invalid ef-dirty ef-touched ef-focusing ef-error-required ef-error-minLength" />
        </div>
    ```
     上面即为生成的节点结构，其中input父级容器会包含默认的 `form-group` classname，以及你通过 `Field` 传入的classname。input节点上会包含一个固定的
     `form-control` classname，以及一组其他的值：
     * `ef-dirty` 
     * `ef-touched`
     * `ef-invalid`
     * `ef-valid`
     * `ef-focusing`
     * `ef-error-required`
     * `ef-error-pattern`
     * `ef-error-minLength`
     * ... more

     具体可以参看示例demo

* ### FieldGroup {High Order React-Component}
    表单项组，暂时只支持 单选和复选。
    ```html
        <h3>性别</h3>
        <FieldGroup type="radio" name="sex">
            <Field label="女" value="0" />
            <Field label="男" value="1" />
        </FieldGroup>

        <h3>爱好</h3>
        <FieldGroup type="checkbox" name="hobbies">
            <Field label="篮球" value="0" />
            <Field label="足球" value="1" />
            <Field label="乒乓球" value="2" />
            <Field label="羽毛球" value="3" />
        </FieldGroup>
    ```
    其中type和name值必须传入。type只能为 `radio`和`checkbox`。

#### 开发 & develop

    $ git clone git@github.com:qiqiboy/react-easyform.git
    $ cd react-easyform/
    $ npm install
    $ npm start
