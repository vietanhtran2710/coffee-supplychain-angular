import { Injectable } from '@angular/core';
import Moralis from 'moralis';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoffeeService {
  private web3: any;
  private artifacts = require('../abi/CoffeeSupplyChain.json');
  private contractAddress = environment.coffeeSupplyChainAddress;
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

  async createBatch(regisNo, farmerName, farmerAddress, exporterName, importerName, currentAccount) {
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.addBasicDetails(regisNo, farmerName, farmerAddress, exporterName, importerName).send({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async getBatches() {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.getPastEvents('PerformCultivation', {fromBlock: 0})
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async getBatchStatus(batchNo, currentAccount) {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.getNextAction(batchNo).call({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async updateFarmInspectorData(batchNo, family, seed, fert, currentAccount) {
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.updateFarmInspectorData(batchNo, family, seed, fert).send({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }
}
