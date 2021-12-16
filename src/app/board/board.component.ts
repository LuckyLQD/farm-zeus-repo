import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup } from '@angular/forms';
import {ethers} from "ethers";
import { WindowRef } from '../window-ref';
import BigNumber from "bignumber.js";
import {Lpguard} from "../lpguard";
import {Tools} from "../tool"


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  showDetail:boolean = false;
  isDeposit:boolean = true;
  depositForm:FormGroup;
  withdrawForm:FormGroup;
  depositAmount: string = "";
  withdrawAmount: string = "";
  balance: string = "";
  totalAsset: string = "";
  totalShare: string = "";
  totalShare18: string = "";
  private lendhub_usdt_eth_tools: any = null;
  private user_provider: any = null;
  private lendhub_usdt_eth_LPG: any;

  constructor(private formBuilder: FormBuilder, private win: WindowRef) {
    this.depositForm = this.formBuilder.group({
      depositAmountInput: [this.depositAmount]
    });
    this.withdrawForm = this.formBuilder.group({
      withdrawAmountInput: [this.withdrawAmount]
    });
    this.user_provider = new ethers.providers.Web3Provider(this.win.nativeWindow.ethereum);
    //Init Tools
    this.lendhub_usdt_eth_tools = new Tools('0xE8FAdDdC61775d56bAe11eB6D2d465D0672DA851', '0x2B9cAa854C9Ba7399e8Aa4BA9261bD290c26ee7F', this.user_provider);
    let user_signer = this.user_provider.getSigner();
    let user_public_key = user_signer.getAddress();
    this.lendhub_usdt_eth_LPG = new Lpguard(user_public_key, '0x2B9cAa854C9Ba7399e8Aa4BA9261bD290c26ee7F', user_signer);

  }

  ngOnInit(): void {
   // this.getBalance();
    const div = document.getElementById('boardContainer');
    // @ts-ignore
    div.addEventListener("transactionInfo", function(e: CustomEvent<any>) { // change here Event to CustomEvent
      console.log(e.detail);
    });
  }

  ngAfterViewInit(): void {
    this.getTotalAsset();
    this.getShare();
  }

  async getBalance() {
    let user_provider = new ethers.providers.Web3Provider(this.win.nativeWindow.ethereum);
    let user_signer = user_provider.getSigner();
    let user_public_key = user_signer.getAddress();

    let t:string = '';
    let usdt_abi = '[ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" } ]';
    let usdt_reader = new ethers.Contract('0xa71EdC38d189767582C38A3145b5873052c3e47a', usdt_abi, user_provider);
    t = await usdt_reader.balanceOf(user_public_key);
    t = this.toDisplayFormat(t.toString(), 18, 6);
    console.log("Balance: ", t);
    this.balance = t;
  }

  //todo: lock UI until total asset is returned
  async getTotalAsset() {
    this.totalAsset = await this.lendhub_usdt_eth_tools.getTotalAsset();
    console.log("totalAsset: ", this.totalAsset);
  }

  //todo: lock UI until total share is returned
  async getShare() {
    let shares = await this.lendhub_usdt_eth_LPG.getShare();
    this.totalShare = shares[1];
    this.totalShare18 = shares[0];
  }

  toDisplayFormat(num:string, decimals:number, fixed:number) {
    let _num = new BigNumber(num);
    let TEN = new BigNumber(10);
    _num = _num.dividedBy(TEN.exponentiatedBy(decimals));
    return _num.toFixed(fixed);
  }

  toggleDeposit(): void {
    this.isDeposit = true;
  }

  toggleWithdraw(): void {
    this.isDeposit = false;
  }

  deposit(): void {
    this.depositAmount = this.depositForm.get('depositAmountInput')?.value;
    this.syncDeposit(this.depositAmount);
  }

  withdraw(): void {
    this.withdrawAmount = this.withdrawForm.get('withdrawAmountInput')?.value;
    let check = this.isWithdrawInputValid();
    if(!check.valid){
      alert(check.msg);
    }else {
      this.syncWithdraw(this.withdrawAmount);
    }
  }

  getMaxShare(): void {
    this.withdrawAmount = this.totalShare;
    this.withdrawForm.patchValue({"withdrawAmountInput": this.totalShare18});
  }

  async syncDeposit(amount: string) {
    await this.lendhub_usdt_eth_LPG.deposit('0xa71EdC38d189767582C38A3145b5873052c3e47a', amount, 18);
  }

  async syncWithdraw(amount: string) {
    await this.lendhub_usdt_eth_LPG.withdraw(amount);
  }

  onItemClick() {
    this.showDetail = !this.showDetail;
    this.getBalance();
  }

  // getFormattedBalance() {
  //   return this.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // }

  validate(e:any) {
    var t = e.target.value;
    e.target.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 7)) : t;
  }

  isWithdrawInputValid(): any {
    let res = {
      "valid": true,
      "msg": ""
    }
    if(!this.withdrawAmount){
      res.valid = false;
      res.msg = "Please enter a valid share";
    }
    let value = Number(this.withdrawAmount);
    let total = Number(this.totalShare);
    if (value > total) {
      res.valid = false;
      res.msg = "Insufficient shares";
    }
    return res;
  }



}
