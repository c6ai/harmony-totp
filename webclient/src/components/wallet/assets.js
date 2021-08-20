import React, { Component } from 'react';
const {
	toBech32,
	fromBech32,
} = require('@harmony-js/crypto');
const web3utils = require("web3-utils");
import { SmartVaultContext, SmartVaultConsumer } from "../smartvault_provider";
import Notifications, {notify} from 'react-notify-toast';
import {
    HashRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class SendPayment extends Component {
	constructor(props) {
		super(props)
		this.state = {gasLimit: "", gasPrice:"", gasFee:""}
	}

    loadHistory() {
        console.log(this.context.smartvault.walletData);
        var self = this;
        this.context.smartvault.getDeposits().then(balance=>{
            self.setState({balance: balance})
        })
    }

	componentDidMount() {
        this.loadHistory();
    }

    updateContractAddress(e) {
        var self = this;
        this.setState({ contractAddress: e.target.value });
        this.context.smartvault.harmonyClient.getERC20Info(e.target.value).then(e=>{
            self.setState({...e})
        })
    }

    addToken(e) {
        e.preventDefault();
        this.context.smartvault.walletData.erc20 = this.context.smartvault.walletData.erc20 || [];
        this.context.smartvault.walletData.erc20.push({
            name: this.state.name,
            symbol: this.state.symbol,
            decimals: this.state.decimals,
            contractAddress: this.state.contractAddress
        });
        this.context.saveWallet();
        
        $('#exampleModal').modal('hide');
    }
	render() {
		return (
			<SmartVaultConsumer>
                {({smartvault}) => (				
			<div className="card">
                <div className="card-header">Assets</div>
				<div className="card-body">
                    <div className="bg-light text-dark p-3 mb-2">
                        <b>ONE</b>
                        <div className="float-right">
                            <span className="mr-4">{this.state.balance && Number(web3utils.fromWei(this.state.balance+"")).toFixed(4)}</span>
                            <Link to="/wallet/send_one">Send</Link>
                        </div>
                    </div>
                    <div className="bg-light text-dark p-3 mb-2">
                        <b>ONE</b>
                        <div className="float-right">
                            <span className="mr-4">0.10</span>
                            <button className="btn btn-dark">Send</button>
                        </div>
                    </div>
                    <div className="text-center mt-3">
                       <a href="#"  data-toggle="modal" data-target="#exampleModal">Add Token</a>
                    </div>
                    
                    <div className="modal fade " tabindex="-1" id="exampleModal" >
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Token</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="inputEmail3" className="col-form-label">Token Contract Address</label>
                                        <div className="">
                                            <input type="text" className="form-control" id="inputEmail3" value={this.state.contractAddress} onChange={this.updateContractAddress.bind(this)} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputEmail3" className="col-form-label">Token Name</label>
                                        <div className="">
                                            <input type="text" className="form-control" id="inputEmail3" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputEmail3" className="col-form-label">Token Symbol</label>
                                        <div className="">
                                            <input type="text" className="form-control" id="inputEmail3" value={this.state.symbol} onChange={(e) => this.setState({ symbol: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="inputEmail3" className="col-form-label">Decimals of Precision</label>
                                        <div className="">
                                            <input type="number" className="form-control" id="inputEmail3" value={this.state.decimals} onChange={(e) => this.setState({ decimals: e.target.value })} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.addToken.bind(this)}>Add</button>
                            </div>
                            </div>
                        </div>
                    </div>
				</div>
			</div>)}
			</SmartVaultConsumer>
		);
	}
}
SendPayment.contextType = SmartVaultContext;

export default SendPayment;