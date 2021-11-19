import { Injectable } from '@angular/core';
import Moralis from 'moralis';
import { environment } from 'src/environments/environment';
import { UserService } from '../supplyUser/user.service';

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

  constructor(private userService: UserService) { 
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

  async getBasicDetails(batchNo, currentAccount) {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.getBasicDetails(batchNo).call({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async getFarmInspectorData(batchNo, currentAccount) {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.getFarmInspectorData(batchNo).call({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async updateHarvesterData(batchNo, variety, temperature, humidity, currentAccount) {
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.updateHarvesterData(batchNo, variety, temperature, humidity).send({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async getHarvesterData(batchNo, currentAccount) {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.getHarvesterData(batchNo).call({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async updateExporterData(batchNo, quantity, destination, shipName, shipNo, date, exporterId, currentAccount) {
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.updateExporterData(batchNo, quantity, destination, shipName, shipNo, date, exporterId).send({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async getExporterData(batchNo, currentAccount) {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.getExporterData(batchNo).call({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async updateImporterData(batchNo, quantity, shipName, shipNo, transportInfo, warehouseName, warehouseAddress, importerID, currentAccount) {
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.updateImporterData(batchNo, quantity, shipName, shipNo, transportInfo, warehouseName, warehouseAddress, importerID)
      .send({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async getImporterData(batchNo, currentAccount) {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.getImporterData(batchNo).call({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async updateProcessorData(batchNo, quantity, temperature, rostingDuration, internalBatchNo, packageDateTime, processorName, processorAddress, currentAccount) {
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.updateProcessorData(batchNo, quantity, temperature, rostingDuration, internalBatchNo, packageDateTime, processorName, processorAddress)
      .send({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async getProcessorData(batchNo, currentAccount) {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.methods.getProcessorData(batchNo).call({from: currentAccount})
      .then(function(result) {
        return resolve(result);
      })
    })
  }

  async getActivityTimestamp(activity, batchNo, currentAccount) {
    await this.initWeb3();
    const that = this;
    return new Promise((resolve, reject) => {
      that.contract.getPastEvents(activity, {fromBlock: 0, filter: {batchNo: batchNo}})
      .then(function(result) {
        try
        {
          that.web3.eth.getBlock(result[0].blockNumber)
          .then(function(blockData) {
            let resultData = {
              dataTime: '',
              transactionHash: '',
              name: '',
              contactNo: '',
              address: ''
            };
            let date = blockData.timestamp;
            date = new Date(date * 1000).toUTCString();

            resultData.dataTime = date;
            resultData.transactionHash = result[0].transactionHash;

            let userAddress = result[0].returnValues.user;
            resultData.address = userAddress;
            if (userAddress.toLowerCase() == that.adminAddress) {
              resultData.name = 'Admin';
              resultData.contactNo = '-';
              return resolve(resultData);
            }
            else {
              that.userService.getUserDetail(userAddress, currentAccount)
              .then(function (result) {
                resultData.name = (result as any).name;
                resultData.contactNo = (result as any).contactNo;
                return resolve(resultData);
              })
            }
          })
        }
        catch(e)
        {
          return reject(false);
        }
      })
    })
  }
}
