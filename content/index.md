---
title: Monero stats, block explorer and charts | MoneroStats.com
description:
keywords:
layout: default
---

<div ng-controller="MainCtl">

   <%= render 'header' %>

<div class="container">
   <noscript></noscript>
   <div class="row">
     <div class="col-xs-12">
        <h1>Monero network stats</h1>
     </div>
   </div>
  <div class="row">
   <div class="col-md-2 text-center">
      <div class="panel panel-primary">
         <div class="panel-heading">
            <h3 class="panel-title">Price</h3>
         </div>
         <div class="panel-body">
            <h4 data-bind="text: price">${{coinmarketcap_data[0].price_usd | number: 2}} | ฿{{coinmarketcap_data[0].price_btc | number: 4}}</h4>
         </div>
      </div>
   </div>
   <div class="col-md-2 text-center">
      <div class="panel panel-info">
         <div class="panel-heading">
            <h3 class="panel-title">Difficulty</h3>
         </div>
         <div class="panel-body">
            <h4 data-bind="text: difficulty">{{info.difficulty}}</h4>
         </div>
      </div>
   </div>
   <div class="col-md-2 text-center">
      <div class="panel panel-success">
         <div class="panel-heading">
            <h3 class="panel-title">Height</h3>
         </div>
         <div class="panel-body">
            <h4 data-bind="text: height">{{info.height}}</h4>
         </div>
      </div>
   </div>
   <div class="col-md-2 text-center">
      <div class="panel panel-danger">
         <div class="panel-heading">
            <h3 class="panel-title">Hash Rate</h3>
         </div>
         <div class="panel-body">
            <h4 data-bind="text: hashRate">{{network_hashrate|hashrateValue}} {{network_hashrate|hashrateUnits}}/s</h4>
         </div>
      </div>
   </div>
   <div class="col-md-2 text-center">
      <div class="panel panel-warning">
         <div class="panel-heading">
            <h3 class="panel-title">All transactions</h3>
         </div>
         <div class="panel-body">
            <h4 data-bind="text: emission">{{info.tx_count}}</h4>
         </div>
      </div>
   </div>
   <div class="col-md-2 text-center">
      <div class="panel panel-primary">
         <div class="panel-heading">
            <h3 class="panel-title">White Nodes</h3>
         </div>
         <div class="panel-body">
            <h4 data-bind="text: whiteNode">{{info.white_peerlist_size}}</h4>
         </div>
      </div>
   </div>
</div>

   <div class="row">
      <div class="col-md-12 topmargin">
            <h5>Latest blocks</h5>
               <section class="blockchain">
                  <table class="table">
                     <thead>
                        <tr>
                           <th>Height</th>
                           <th>Timestamp (UTC)</th>
                           <th class="text-center">Size</th>
                           <th class="text-center">Transactions</th>
                           <th>Hash</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr ng-repeat="block in blocks">
                           <td><a target="_self" href="/blockchain/block/?hash={{block.hash}}">{{block.height}}</a></td>
                           <td><span><span>{{ block.timestamp | amFromUnix | amUtc | amDateFormat:'YYYY-MM-DD HH:mm:ss' }}</span></span><span> (</span><span>{{block.timestamp | amFromUnix | amUtc | timeAgo}}</span><span>)</span></td>
                           <td class="text-center">{{block.cumul_size}}</td>
                           <td class="text-center">{{block.tx_count}}</td>
                           <td><a target="_self" href="/blockchain/block/?hash={{block.hash}}">{{block.hash}}</a></td>
                        </tr>
                     </tbody>
                  </table>
               </section>
                  <ul class="pager">
                     <li><a href="/blockchain/?height={{info.height - 31}}" title="monero blockchain explorer">See more blocks</a></li>
                  </ul>
         </div>
      </div>
   </div>
</div>
<!-- /.container -->

<script src="/js/scripts.js"></script>

<script src="/js/app.js"></script>