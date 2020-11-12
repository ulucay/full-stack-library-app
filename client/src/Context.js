import React, { Component } from 'react';
import { Data } from './Data';
import Cookies from 'js-cookie';

const Context = React.createContext();

export class Provider extends Component {
    constructor() {
        super();
        this.data = new Data();
    }

    state = {
        authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
        token: Cookies.getJSON('token') || null,
    }

    render() {
        const { authenticatedUser, token } = this.state;
        const value = {
            authenticatedUser,
            token,
            data: this.data,
            actions: {
                signIn: this.signIn,
                signOut: this.signOut,
            },
        };

        return (
            <Context.Provider value={value} >
                {this.props.children}
            </Context.Provider>
        );
    }

    //Context actions
    signIn = async (emailAddress, password) => {

        const encodedCredentials = btoa(`${emailAddress}:${password}`);
        const token = `Basic ${encodedCredentials}`

        const user = await this.data.getUser(token);
        if (user !== null) {
            this.setState(() => {
                return { authenticatedUser: user, token }
            });


            Cookies.set('authenticatedUser', JSON.stringify(user),{ expires: 1 });
            Cookies.set('token', JSON.stringify(token), { expires: 1 });
        }
        return user;
    }

    signOut = () => {
        this.setState({
            authenticatedUser: null,
            token: null,
        });
        Cookies.remove('authenticatedUser');
        Cookies.remove('token');
    }
}

export const Consumer = Context.Consumer;


export default function withContext(Component) {
    return function ContextComponent(props) {
        return (
            <Context.Consumer>
                {context => <Component {...props} context={context} />}
            </Context.Consumer>
        );
    }
}
