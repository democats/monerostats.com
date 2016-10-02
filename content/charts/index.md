---
title: Monero charts | MoneroStats.com
description: 
keywords: 
layout: default
---

<div ng-controller="BlockchainChartsCtl">
   <%= render 'header' %>
   <div class="container">
      <noscript></noscript>
         <div ng-show="type == 'basic'" class="ng-hide">
            <h1><span>Monero basic charts</span></h1>
            <div class="row">
               <div class="col-md-12" id="difficulty_avg">
                  <highchart id="chart1" config="chartDifficultyConfig" class="span6"></highchart>
                  <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart('monero', 'difficulty_avg', '1h', 'chartDifficultyConfig', 'toMicrotime', 'Monero Difficulty', '', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
                  </div>
               </div>
            </div>
            <div class="row">
               <div class="col-md-12" id="hashrate">
                  <highchart id="chart2" config="chartHashrateConfig" class="span6"></highchart>
                  <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart('monero', 'hashrate', '1h', 'chartHashrateConfig', 'toMicrotime', 'Monero Hashrate', ' H/s', 2)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
                  </div>
               </div>
            </div>
            <div class="row">
               <div class="col-md-12" id="generated_coins">
                  <highchart id="chart3" config="chartGeneratedCoinsConfig" class="span6"></highchart>
                  <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart('monero', 'generated_coins', '1h', 'chartGeneratedCoinsConfig', 'toMicrotimeCoins', 'Monero Generated coins', '', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
                  </div>
               </div>
            </div>
            <div class="row">
               <div class="col-md-12" id="block_reward">
                  <highchart id="chart4" config="chartBlockRewardConfig" class="span6"></highchart>
                  <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart('monero', 'block_reward', '1h', 'chartBlockRewardConfig', 'toMicrotimeCoins', 'Monero Block reward', '', 2)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
                  </div>
               </div>
            </div>
            <div class="row">
               <div class="col-md-12" id="blockchain_size">
                  <highchart id="chart4" config="chartBlockchainSize" class="span6"></highchart>
                  <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart('monero', 'blockchain_size', '1h', 'chartBlockchainSize', 'toMicrotimeMB', 'Monero Blockchain size', 'MB', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
                  </div>
               </div>
            </div>
         </div>
         <div ng-show="type == 'transactions'" class="ng-hide">
            <h1><span>Monero transactions charts</span></h1>
            <div class="row">
               <div class="col-md-12" id="chartTransactionsCountAllConfig">
                  <highchart id="chart5" config="chartTransactionsCountAllConfig" class="span6"></highchart>
                  <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart('monero', 'transactions_count_all', '1h', 'chartTransactionsCountAllConfig', 'toMicrotime', 'Monero Transactions count (all)', '', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
                  </div>
               </div>
            </div>
            <div class="row">
               <div class="col-md-12" id="chartTransactionsCountConfig">
                  <highchart id="chart5" config="chartTransactionsCountConfig" class="span6"></highchart>
                  <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart('monero', 'transactions_count', '1h', 'chartTransactionsCountConfig', 'toMicrotime', 'Monero Transactions count (per period)', '', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
                  </div>
               </div>
            </div>
            <div class="row">
               <div class="col-md-12" id="chartTransactionsFeesConfig">
                  <highchart id="chart1" config="chartTransactionsFeesConfig" class="span6"></highchart>
                  <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart('monero', 'transactions_fees', '1h', 'chartTransactionsFeesConfig', 'toMicrotimeCoins', 'Monero Transactions fees', '', 2)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
                  </div>
               </div>
            </div>
            <div class="row">
               <div class="col-md-12" id="chartTransactionsOutputsConfig">
                  <highchart id="chart1" config="chartTransactionsOutputsConfig" class="span6"></highchart>
                  <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart('monero', 'transactions_outputs', '1h', 'chartTransactionsOutputsConfig', 'toMicrotimeCoins', 'Monero Transactions outputs (sum)', '', 2)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
                  </div>
               </div>
            </div>
            <div class="row">
               <div class="col-md-12" id="chartTransactionsSizeConfig">
                  <highchart id="chart1" config="chartTransactionsSizeConfig" class="span6"></highchart>
                  <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart('monero', 'transactions_size_avg', '1h', 'chartTransactionsSizeConfig', 'toMicrotime', 'Monero Transactions size (avg)', 'bytes', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
                  </div>
               </div>
            </div>
         </div>
         <div ng-show="type == 'blocks'" class="ng-hide">
            <h1><span>Monero blocks charts</span></h1>
            <div class="row">
               <div class="col-md-12" id="chartBlocksSizeConfig">
                  <highchart id="chart1" config="chartBlocksSizeConfig" class="span6"></highchart>
                  <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart('monero', 'blocks_size_avg', '1h', 'chartBlocksSizeConfig', 'toMicrotime', 'Monero Blocks size (average)', ' bytes', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
                  </div>
               </div>
            </div>
            <div class="row">
               <div class="col-md-12" id="chartBlocksTimeConfig">
                  <highchart id="chart1" config="chartBlocksTimeConfig" class="span6"></highchart>
                  <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart('monero', 'blocks_time_avg', '1h', 'chartBlocksTimeConfig', 'toMicrotime', 'Monero Blocks time (average)', ' s', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
                  </div>
               </div>
            </div>
            <div class="row">
               <div class="col-md-12" id="chartBlocksCurrentTxMedianConfig">
                  <highchart id="chart1" config="chartBlocksCurrentTxMedianConfig" class="span6"></highchart>
                  <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart('monero', 'block_current_txs_median_max', '1h', 'chartBlocksCurrentTxMedianConfig', 'toMicrotime', 'Monero Current tx median', ' bytes', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
                  </div>
               </div>
            </div>
            <div class="row">
               <div class="col-md-12" id="chartBlocksPenaltyPercentageConfig">
                  <highchart id="chart1" config="chartBlocksPenaltyPercentageConfig" class="span6"></highchart>
                  <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart('monero', 'blocks_penalty_percentage', '1h', 'chartBlocksPenaltyPercentageConfig', 'toMicrotime', 'Monero Percentage of blocks with penalty', '%', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
                  </div>
               </div>
            </div>
         </div>
   </div>
</div>
<script src="/js/scripts.js"></script>
<script src="/js/app.js"></script>