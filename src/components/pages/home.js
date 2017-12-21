"use strict"
import React, { Component } from 'react';
import { Paper, RaisedButton } from 'material-ui';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Home extends Component{

    render(){
        return(
            <div class='jsxWrapper'>
                <div class="fullHeight greenToBlue">
                    <div class="infoBox whiteText">
                        Skip the resum&eacute;.<br/>
                        Learn skills for the future<br/>
                        that employers want now,<br/>
                        <i>for free.</i><br/>
                        <button class="outlineButton blueWhiteButton">
                            Get Started
                        </button>
                    </div>
                </div>
                <div class="fullHeight">
                    <div class="infoBox greenText">
                        <i>Companies are searching<br/>
                        for people to spearhead<br/>
                        the future of technology</i><br/>
                        <button class="outlineButton whiteBlueButton">
                            Join the Movement
                        </button>
                    </div>
                </div>


                <div>
                    {this.props.emailSentMessage ?
                        <Paper className="messageHeader infoHeader">
                            {this.props.emailSentMessage}
                        </Paper>
                        :
                        null
                    }
                    <Paper className="form" zDepth={2}>
                        <h1>Home</h1>
                        <h3>
                            Moonshot learning is a company that is amazing.
                        </h3>
                    </Paper>
                </div>
            </div>
        );
    }
}

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({
//         postUser,
//         getUsers
//     }, dispatch);
// }

function mapStateToProps(state) {
    return {
        emailSentMessage: state.users.emailSentMessage
    };
}

export default connect(mapStateToProps)(Home);
