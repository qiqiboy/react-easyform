import React, { Component } from 'react';
import EasyForm, { Field, FieldGroup } from '../../src';

class Form extends Component {
    state = {
        regType: 'phone'
    }

    componentDidMount() {
        /* 必须有，用来初始化表单项 */
        this.props.easyform.init(this.refs);
    }

    submit = ev => {
        alert('submit!');
    }

    toggleRegType = () => {
        this.setState({
            regType: this.state.regType === 'phone' ? 'email' : 'phone'
        });
    }

    getBirthdayYears() {
        let years = [];
        const now = (new Date()).getFullYear();
        const from = now - 80;

        for(let i = from; i < now - 18; i++ ) {
            years.unshift(<option key={i} value={i}>{i}</option>);
        }

        return years;
    }

    render() {
        const {params, $error, $invalid} = this.props.easyform;

        return (
            <form className="" onSubmit={this.submit}>
                <h3 className="page-title">react-easyform Example</h3>
                <div className="container">
                    <div className="content">
                        <h3 className="form-title">账号</h3>
                        <div className="form-meta">这里示范了常见的用户名、密码表单如何使用，另外还有两次密码校验一致性检测</div>
                        <Field type="text" placeholder="用户名" ref="username" required pattern={/^[\w]+$/}
                            validMessage={{required: '请填写用户名', pattern: '用户名不能包含字母数字下划线以外的字符'}} />
                        <Field type="text" placeholder="请输入密码" ref="password" required confirmed={this.refs.confirm_password} validMessage={{required: '请填写密码'}} />
                        <Field type="text" placeholder="请再次输入密码" ref="confirm_password" confirm={this.refs.password} required validMessage={{required: '请填写密码', confirm: '两次密码不一致'}} />
                        <h3 className="form-title">性别</h3>
                        <div className="form-meta">单选组</div>
                        <FieldGroup type="radio" ref="sex" name="sex" required
                            validMessage={{required: '请选择性别'}}>
                            <Field label="男" value="0" />
                            <Field label="女" value="1" />
                        </FieldGroup>
                        <h3 className="form-title">爱好</h3>
                        <div className="form-meta">这里是一个多选组，可以通过 minLength="2" 要求至少选择2个。同理， maxLength="3" 将会限制至多选择三个。<br/>easyform将会将所选择的值转为一个数组。
                            <br/>如果需要默认值可以指定一个数组，例如 defaultValue={[1, 2]}
                        </div>
                        <FieldGroup type="checkbox" ref="hobbies" name="hobbies" required minLength="2"
                            validMessage={{required: '请选择你的爱好', minLength: '至少选择两个爱好'}}>
                            <Field label="篮球" value="0" />
                            <Field label="足球" value="1" />
                            <Field label="乒乓球" value="2" />
                            <Field label="羽毛球" value="3" />
                        </FieldGroup>
                        <h3 className="form-title">生日</h3>
                        <div className="form-meta">这里展示了下拉框如何使用，另外通过 max="1960" 限制了年龄要求</div>
                        <Field type="select" ref="birthday" required max="1960" validMessage={{required: '请选择生日', max: '您的年纪不符合要求（必须是1960年以前出生的人）'}}>
                            <option value="">请选择</option>
                            {this.getBirthdayYears()}
                        </Field>
                        <h3 className="form-title">联系方式 {<a href="javascript:void(0);" onClick={this.toggleRegType}>{this.state.regType === 'phone' ? '使用邮箱注册' : '使用手机注册'}</a>}</h3>
                        <div className="form-meta">
                            这里示范了不同状况下可以动态改变表单项组合，可以通过点击上方链接切换不同的联系方式填写。
                            <br/><br/>
                            手机号这里支持多国手机号格式校验的输入，+86要求输入11位数字，+886要求输入8位数字。支持动态校验，输入手机号后再切换国家依然可以校验。</div>
                        {this.state.regType === 'phone' ? <div className="form-inline-half">
                            <Field type="select" ref="tel_code" confirmed={this.refs.phone} max="1960">
                                <option value="86">中国+86</option>
                                <option value="886">台湾+886</option>
                            </Field>
                            <Field type="text" placeholder="请输入手机号" ref="phone" required pattern={params.tel_code === '86' ? /^1\d{10}$/ : /^\d{8}$/} validMessage={{required: '请填写手机号', pattern: '手机号格式错误'}} />
                        </div> : <Field type="text" placeholder="请输入邮箱" ref="email" required pattern={/^\w+@[.\w]+$/} validMessage={{required: '请填写邮箱', pattern: '邮箱格式错误'}} />}
                    </div>
                    <div className="sidebar">
                        <button className="btn-submit" disabled={$invalid ? 'disabled' : false}>提交</button>
                        <pre>表单项参数：{JSON.stringify(params, '\t', 4)}</pre>
                        <pre>表单项错误：{JSON.stringify($error, '\t', 4)}</pre>
                    </div>
                </div>
            </form>
        );
    }
}

export default EasyForm(Form, 2);

