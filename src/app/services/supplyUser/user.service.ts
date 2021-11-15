import { Injectable } from '@angular/core';
import Moralis from 'moralis';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private web3: any;
  private artifacts = require('../abi/SupplyChainUser.json');
  private contractAddress = environment.supplyChainUserAddress;
  private contractABI = this.artifacts.abi;
  private adminAddress = environment.adminAddress
  private contract: any; 

  constructor() { 
    this.initWeb3();
  }

  async initWeb3() {
    this.web3 = await Moralis.enable();
    this.contract = await new this.web3.eth.Contract(this.contractABI, this.contractAddress);
  }

  async getPastEvents() {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.getPastEvents('UserUpdate')
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async getUserDetail(address, currentAccount) {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.getUser(address).call({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async createUser(address, name, contact, role, currentAccount) {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.updateUserForAdmin(address, name, contact, role, true, "").send({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }
}
