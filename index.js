const Discord = require("discord.js");
const fs = require("fs");
const util = require("util");
var numbers = JSON.parse(fs.readFileSync("./numbers.json", "utf8"));
var daily = JSON.parse(fs.readFileSync("./daily.json", "utf8"));
var calls = JSON.parse(fs.readFileSync("./call.json", "utf8"));
var phonebook = JSON.parse(fs.readFileSync("./phonebook.json", "utf8"));
var fouroneone = JSON.parse(fs.readFileSync("./fouroneone.json", "utf8"));
var accounts = JSON.parse(fs.readFileSync("./account.json", "utf8"));
var emotes = JSON.parse(fs.readFileSync("./emotes.json", "utf8"));
var support = user_id => bot.guilds.get('281815661317980160').roles.get('281815839936741377').members.map(member => member.id).indexOf(user_id) > -1;
var chef = user_id => bot.guilds.get('281815661317980160').roles.get('310144282717847552').members.map(member => member.id).indexOf(user_id) > -1;
var blacklist = JSON.parse(fs.readFileSync("./blacklist.json", "utf8"));
var blacklisted = user_id => blacklist.indexOf(user_id) > -1;
var orders = JSON.parse(fs.readFileSync("./orders.json", "utf8"));
var menu = JSON.parse(fs.readFileSync("./menu.json", "utf8"));
var request = require("request");
var schedule = require('node-schedule');
var cprefix = "0301"; // Current prefix, `>wizard`
var award = JSON.parse(fs.readFileSync("./award.json", "utf8"));
var ns = 0;
var nsroles = JSON.parse(fs.readFileSync("./ns.json", "utf8"));
var nsguild = JSON.parse(fs.readFileSync("./nsg.json", "utf8"));
const bot = new Discord.Client({ disableEveryone: true });
var restify = require('restify');
var suggestionchannel = "326798754348793857";
var server = restify.createServer({
	name : "Bot HTTP server"
});
var discoin_token = "Censored";
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
server.listen(port, ipaddress, function () {
	console.log('%s listening to %s', server.name, server.url);
});

var mailbox_storage=JSON.parse(fs.readFileSync("./mailbox.json","utf8"));
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4();
}
var recentCall={};

bot.on("ready", () => {
    console.log("I am ready!");
    bot.user.setPresence({game:{name:bot.guilds.array().length+" servers | >help"}});
	request.post({
		url: "https://bots.discordlist.net/api",
		form: {
			"token": "Censored",
			"servers": bot.guilds.size.toString()
		}
	}, function(error, response, body) {
		console.log("DList returns success: "+ body);
	});
	request.post({
		url: "https://bots.discord.pw/api/bots/224662505157427200/stats",
		headers: {
			"content-type": "application/json",
			"Authorization": "Censored"
		},
		json: {
			"server_count": bot.guilds.size.toString()
		}
	}, function(error, response, body) {
		console.log("DBots returns success: "+ body);
	});
	request.post({
		url: "https://discordbots.org/api/bots/224662505157427200/stats",
		headers: {
			"content-type": "application/json",
			"Authorization": "Censored"
		},
		json: {
			"server_count": bot.guilds.size.toString()
		}
	}, function(error, response, body) {
		console.log("DBotsList returns success: "+ body);
	});
	orders.filter(i => {return i.status === 0;}).forEach(k => {orders.splice(orders.indexOf(k));fs.writeFile("./orders.json", JSON.stringify(orders), "utf8");});
});
bot.on("message", message => {
	if (!message.author.bot && message.content.split(':').length === 3 && !blacklisted(message.author.id) && message.guild.member(bot.user.id).hasPermission("USE_EXTERNAL_EMOJIS") && !message.content.startsWith("<") && !message.content.endsWith(">")) {
		var emote = emotes.find(i => {return i.name === message.content.split(':')[1];});
		if (emote !== undefined) {
			message.channel.send("<:"+emote.name+":"+emote.id+">");
		}
	}
	if (message.content.startsWith(">")) {
		console.log(message.author.username + "#" + message.author.discriminator + " > " + message.content);
	}
	var account = accounts.find(function(item) {
		return item.user === message.author.id;
	});
	var mynumber = numbers.find(function(item) {
		return item.channel === message.channel.id;
	});
	var myorder = orders.find(function(item) {
		return item.user === message.author.id;
	});
	var call = calls.find(function(item) {
		if (	item.from.channel === message.channel.id) {
			return item.from.channel === message.channel.id;
		}
		else if (item.to.channel === message.channel.id) {
			return item.to.channel === message.channel.id;
		}
		else {return undefined;}
	});
	var pbstatus = fouroneone.find(function(item) {
		return item.user === message.author.id;
	});

	// call options TODO: this
	/*if(message.content.startsWith(">call")){
		if(!call){
			var yournumber=message.content.split(" ").slice(1).join(" ");
			callNumber(yournumber,message,call,mynumber);
		} // no call; normal function
		var msg=message;
		switch(msg.content.split(" ")[1]){
			case "foward":

			break;
			default:
			var embed=new Discord.RichEmbed();
			embed.setTitle("<:GoldPhone:320768431307882497> Call Options");
			embed.setDescription("`>call forward [number]` *Forward call*");
		}
	}*/

	if (message.author.id === "213466096718708737" && message.channel.id === "329013929890283541") {
		var user = message.content.split(" ")[0];
		var amount = message.content.split(" ")[2].replace("**", "").replace("**", "");
		var aftertax = parseInt(amount);
		var theaccount = accounts.find(function(item) {
			return item.user === user;
		});
		if (theaccount === undefined) {
			theaccount = {user:user,balance:aftertax};
			accounts.push(theaccount);
			bot.users.get(user).send("You don't have an account created...Creating an account for you! Please also read for information on payment: <http://discordtel.readthedocs.io/en/latest/Payment/>");
		}
		else {
			accounts.splice(accounts.indexOf(theaccount), 1);
			theaccount.balance += aftertax;
			accounts.push(theaccount);
		}
		fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
		bot.users.get(theaccount.user).send(":yen: We've received ¥"+aftertax+" from your Mantaro credit account. You now have ¥"+theaccount.balance+".");
		bot.channels.get("282253502779228160").send(":yen: Received ¥"+aftertax+" from "+bot.users.get(user).username+" ("+user+") using Mantaro. The user now has ¥"+theaccount.balance+".");
		message.delete();
	}
	else if (message.author.id === "213271889760616449" && message.channel.id === "329013929890283541") {
		var user = message.content.split(" ")[3];
		var amount = message.content.split(" ")[6];
		var aftertax = parseInt(amount);
		var theaccount = accounts.find(function(item) {
			return item.user === user;
		});
		if (theaccount === undefined) {
			theaccount = {user:user,balance:aftertax};
			accounts.push(theaccount);
			bot.users.get(user).send("You don't have an account created...Creating an account for you! Please also read for information on payment: <http://discordtel.readthedocs.io/en/latest/Payment/>");
		}
		else {
			accounts.splice(accounts.indexOf(theaccount), 1);
			theaccount.balance += aftertax;
			accounts.push(theaccount);
		}
		fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
		bot.users.get(theaccount.user).send(":yen: We've received ¥"+aftertax+" from your DueUtil DUT account. You now have ¥"+theaccount.balance+".");
		bot.channels.get("282253502779228160").send(":yen: Received ¥"+aftertax+" from "+bot.users.get(user).username+" ("+user+") using DueUtil. The user now has ¥"+theaccount.balance+".");
		message.delete();
	}
	else if (message.author.id === "227171028072267778" && message.channel.id === "329013929890283541") {
		var user = message.content.split(" ")[0];
		var amount = message.content.split(" ")[2];
		var aftertax = parseInt(amount) * 3/4;
		var theaccount = accounts.find(function(item) {
			return item.user === user;
		});
		if (theaccount === undefined) {
			theaccount = {user:user,balance:aftertax};
			accounts.push(theaccount);
			bot.users.get(user).send("You don't have an account created...Creating an account for you! Please also read for information on payment: <http://discordtel.readthedocs.io/en/latest/Payment/>");
		}
		else {
			accounts.splice(accounts.indexOf(theaccount), 1);
			theaccount.balance += aftertax;
			accounts.push(theaccount);
		}
		fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
		bot.users.get(theaccount.user).send(":yen: We've received ¥"+aftertax+" (After 25% tax) from your Hifumi credit account. You now have ¥"+theaccount.balance+".");
		bot.channels.get("282253502779228160").send(":yen: Received ¥"+aftertax+" from "+bot.users.get(user).username+" ("+user+") using Hifumi. The user now has ¥"+theaccount.balance+".");
		message.delete();
	}
	else if (!message.author.bot && myorder !== undefined && myorder.status === 0 && message.channel.id === myorder.channel) {
		message.channel.fetchMessage(myorder.message).then(msg => {
			if (message.content === "0") {
				if (account === undefined) {
					account = {user:message.author.id,balance:0};
					accounts.push(account);
					fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
					message.reply("You don't have an account created...Creating an account for you! Please also read for information on payment: <http://discordtel.readthedocs.io/en/latest/Payment/>");
				}
				if (myorder.order === "") {
					orders.splice(orders.indexOf(myorder), 1);
					fs.writeFileSync("./orders.json", JSON.stringify(orders), "utf8");
					msg.delete();
					message.reply("Order aborted!");
				}
				else if (account.balance < myorder.price) {
					orders.splice(orders.indexOf(myorder), 1);
					fs.writeFileSync("./orders.json", JSON.stringify(orders), "utf8");
					msg.delete();
					message.reply("The bill is "+myorder.price+" DTel credits. You have insufficient fund, so your order is aborted.");
				}
				else {
					orders.splice(orders.indexOf(myorder), 1);
					myorder.status = 1;
					message.delete();
					orders.push(myorder);
					fs.writeFileSync("./orders.json", JSON.stringify(orders), "utf8");
					msg.edit("", {embed:new Discord.RichEmbed().setColor("#6F4E37").setTitle("Here's your bill!").setDescription("Type `yes` to confirm and pay the money, or type `no` to cancel.").addField("Your order", myorder.ordertext).addField("Note", myorder.note).addField("Price", myorder.price + " DTel credits")});
				}
			}
			else if (message.content.startsWith(">note")) {
				if (myorder.note !== undefined) {
					message.reply("You already added a note!");
					message.delete();
				}
				else {
					orders.splice(orders.indexOf(myorder), 1);
					myorder.note = message.content.replace(">note ", "");
					message.delete();
					orders.push(myorder);
					fs.writeFileSync("./orders.json", JSON.stringify(orders), "utf8");
					msg.edit("", {embed:new Discord.RichEmbed().setColor("#6F4E37").setTitle("Note added.").setDescription("You may try again.").addField("Your order", myorder.ordertext).addField("Note", myorder.note).addField("Price", myorder.price + " DTel credits").setFooter("Type 0 to finish your order.")});
				}
			}
			else {
				var menuitem = menu.find(function(item){
					return item.id === parseInt(message.content);
				});
				if (menuitem !== undefined) {
					orders.splice(orders.indexOf(myorder), 1);
					myorder.order += message.content + " ";
					myorder.ordertext += menuitem.name + ", ";
					myorder.price += menuitem.price;
					message.delete();
					orders.push(myorder);
					fs.writeFileSync("./orders.json", JSON.stringify(orders), "utf8");
					msg.edit("", {embed:new Discord.RichEmbed().setColor("#6F4E37").setTitle("1 " + menuitem.name + " is successfully added to your order!").addField("Your order", myorder.ordertext).addField("Note", myorder.note).addField("Price", myorder.price + " DTel credits").setFooter("You can `>note <Your note>` to further customize your order.\nType 0 to finish your order.")});
				}
				else {
					message.delete();
					msg.edit("", {embed:new Discord.RichEmbed().setColor("#C11B17").setTitle("Error: Item \""+message.content+"\" does not exist!").setDescription("You may try again.").addField("Your order", myorder.ordertext).addField("Note", myorder.note).addField("Price", myorder.price + " DTel credits").setFooter("You can `>note <Your note>` to further customize your order.\nType 0 to finish your order.")});
				}
			}
		});
	}
	else if (!message.author.bot && myorder !== undefined && myorder.status === 1 && message.channel.id === myorder.channel) {
		message.channel.fetchMessage(myorder.message).then(msg => {
			if (message.content === "yes") {
				accounts.splice(accounts.indexOf(account), 1);
				account.balance -= myorder.price;
				accounts.push(account);
				message.reply("You've paid your order. Your order has been transferred to our kitchen and will be prepared shortly. In the meantime, you can check your order by typing `>order`.");
				orders.splice(orders.indexOf(myorder), 1);
				myorder.status = 2;
				bot.channels.get("310144658552651777").sendEmbed(new Discord.RichEmbed().setColor("#F1C40F").setTitle("New order!").addField("User", message.author.username + "#" + message.author.discriminator).addField("Content", myorder.ordertext).addField("Note", myorder.note)).then(newmsg => {
					myorder.message = newmsg.id;
					myorder.user = message.author.id;
					newmsg.react("\u2705");
					newmsg.react("\u274c");
					orders.push(myorder);
					fs.writeFileSync("./orders.json", JSON.stringify(orders), "utf8");
					bot.channels.get("282253502779228160").send(":fork_and_knife: User "+message.author.username+" paid ¥"+myorder.price+" for a Catering Service order. The user now have ¥"+account.balance+".");
				});
			}
			else if (message.content === "no") {
				orders.splice(orders.indexOf(myorder), 1);
				fs.writeFileSync("./orders.json", JSON.stringify(orders), "utf8");
				message.reply("Order aborted!");
			}
		});
	}
    else if (!message.author.bot && call === undefined && pbstatus === undefined && message.author.id !== "224662505157427200" && !blacklisted(message.author.id)) {
		if (message.content === ">help") {
			message.channel.sendEmbed(new Discord.RichEmbed().setColor("#007FFF").setTitle("List of Commands").setDescription("For more information, use `>info`.").addField(">dial / >call", "Dial a number using your own number").addField(">pdial / >pcall", "Dial a number using public payphone, 8 credits per message").addField(">rdial / >rcall","Dial a random number in the phonebook (*411)").addField(">wizard","Get yourself a number").addField(">order","Get some virtual food").addField(">mailbox", "Check your number's mailbox, plus various settings").addField(">suggest", "Suggest something to be added to the bot").addField(">convert", "Convert your credits into other bot currency via [Discoin](http://discoin.sidetrip.xyz)").addField("Other commands about money", "`>daily`, `>lottery`").addField("You probably know how these commands work", "`>invite`, `>info`"));
		}
		else if(message.content.startsWith(">suggest")) {
			if (message.content.split(" ")[1] === undefined){
				message.reply(":x: Usage: `>suggest <suggestion>`")
				return;
			}
			message.reply("Thanks for your suggestion!");
	    		bot.channels.get("326798754348793857").send("New suggestion from __" + message.author.username + "#" + message.author.discriminator + "__ (" + message.author.id + ") ```\n" + message.content.split(" ").splice(1).join(" ").split("```").join(" ") + "```");
		}
		else if (message.content.startsWith(">lottery") && message.author.id !== "104559847118225408") {
			if (message.content.split(" ")[1] === undefined) {
				var myentry = award.users.filter(item => {return item === message.author.id}).length;
				message.reply("You have "+myentry+" entries. The current jackpot is ¥"+award.amount+".");
				return;
			}
			else if (isNaN(parseInt(message.content.split(" ")[1]))) {
				message.reply("Not a number!\n`>lottery <Amount of entries>`. 1 Entry costs 5 credits.");
				return;
			}
			else if (parseInt(message.content.split(" ")[1]) < 0) {message.reply("Get some help.");return;}
			var entries = parseInt(message.content.split(" ")[1]);
			if (account === undefined) {
				account = {user:message.author.id,balance:0};
				accounts.push(account);
				bot.users.get(message.author.id).send("You don't have an account created...Creating an account for you! Please also read for information on payment: <http://discordtel.readthedocs.io/en/latest/Payment/>");
			}
			if (account.balance < entries * 5) {
				message.reply("Insufficient fund! 1 Entry costs 5 credits.");
				return;
			}
			accounts.splice(accounts.indexOf(account), 1);
			account.balance -= entries * 5;
			accounts.push(account);
			for (var i = 0; i < entries; i++) {
				award.users.push(message.author.id);
			}
			award.amount += entries * 5;
			fs.writeFileSync("./award.json", JSON.stringify(award), "utf8");
			message.reply("You've bought "+entries+" entries. The current jackpot is ¥"+award.amount+".");
			bot.channels.get("282253502779228160").send(":tickets: User "+message.author.username+" paid ¥"+entries * 5+" for the lottery. The user now have ¥"+account.balance+".");
		}
		else if (message.content.startsWith(">daily")) {
			if (dailies.indexOf(message.author.id) > -1) {
				message.reply("You already claimed your daily credits!");
				return;
			}
			request.get({
				url: "https://discordbots.org/api/bots/224662505157427200/votes?onlyids=true",
				headers: {
					"content-type": "application/json",
					"Authorization": "Censored"
				}
			}, function(error, response, body) {
				if (!error && response.statusCode === 200) {
					body = JSON.parse(body);
					if (body.indexOf(message.author.id) > -1) {
						message.reply("Here's your 180 credits! You can claim again after 01:00 CET (Approx. 23:00 UTC in summer, 00:00 UTC in winter).");
						dailies.push(message.author.id);
						fs.writeFileSync("./daily.json", JSON.stringify(dailies), "utf8");
						if (account !== undefined) {
							accounts.splice(accounts.indexOf(account), 1);
						} else {
							account = {user: message.author.id, balance: 0};
						}
						account.balance += 180;
						accounts.push(account);
						bot.channels.get("282253502779228160").send(":calendar: "+message.author.username+"#"+message.author.discriminator+" ("+message.author.id+") claimed 180 daily credits!");
						fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
					}
					else {
						message.reply("Here's your 120 credits! You can claim again after 01:00 CET (Approx. 23:00 UTC in summer, 00:00 UTC in winter).\n*Get 60 more credits daily by upvoting at <https://discordbots.org/bot/224662505157427200>!*");
						dailies.push(message.author.id);
						fs.writeFileSync("./daily.json", JSON.stringify(dailies), "utf8");
						if (account !== undefined) {
							accounts.splice(accounts.indexOf(account), 1);
						} else {
							account = {user: message.author.id, balance: 0};
						}
						account.balance += 120;
						accounts.push(account);
						bot.channels.get("282253502779228160").send(":calendar: "+message.author.username+"#"+message.author.discriminator+" ("+message.author.id+") claimed 120 daily credits!");
						fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
					}
				}
				else {message.reply("Cannot connect to DiscordBots.org. Try again.");}
			});
		}
		else if (message.content === ">info") {
		    message.reply("check your DM!");
		    message.author.sendEmbed(new Discord.RichEmbed().setColor("#007FFF").setTitle("DTel Information").setDescription("For command help, use `>help`.").addField("Getting a number", "Before getting a number, you need to reserve a channel for your phone. Once you have done this, you'll have to run the `>wizard` command in the channel to get a number.").addField("Number prefixes", "Most numbers have a prefix of `03XX`, where `XX` represents your shard number. There are some numbers with a prefix of `0900`, which are DM numbers (numbers you can assign in a direct message with the bot), and they act the same as `03XX` numbers, which can *also* have the same digits as `03XX` numbers. Numbers starting with `0800` or `0844`, as well as short codes starting with `*` or `#` are for special uses. Numbers starting with `05XX` are public payphones which can be only called by `>pdial`.").addField("Recharging", "See [this page](http://discordtel.readthedocs.io/en/latest/Payment/) for details.\nAfter recharging, dial `*233` or `>balance` to check balance.").addField("Phonebook and setup your registry","`>dial *411`").addField("Invite the bot", "https://discordapp.com/oauth2/authorize?client_id=224662505157427200&scope=bot&permissions=84997\n\"Embed Links\" is optional, depends on whether you want the bot to show embed links in calls or not.").addField("Official Server", "https://discord.gg/RN7pxrB").addField("Detailed Guide", "http://discordtel.rtfd.io"));
		}
		else if (message.content === ">invite") {
			message.reply("https://discordapp.com/oauth2/authorize?client_id=224662505157427200&scope=bot&permissions=67169284 All perms are essential");
		}
		else if (message.content === ">order") {
			if (myorder !== undefined) {
				var status = "Awaiting claim";
				if (myorder.status === 3) {status = "Started preparation";}
				if (myorder.ordertext === undefined) {
					message.reply("I FUCKED UP! Please go straight to `>order delete` and report to austinhuang#1076 indicating everything you did in your order.");
					return;
				}
				message.channel.sendEmbed(new Discord.RichEmbed().setColor("#6F4E37").setTitle("You already have an order!").setDescription("You can review your current order, or `>order delete` to withdraw.").addField("Your order", myorder.ordertext).addField("Status", status));
			}
			else if (!message.guild) {
				message.reply("ORDER IN A SERVER!!!!!!");
			}
			else if (!message.guild.member(bot.user.id).hasPermission("CREATE_INSTANT_INVITE")) {
				message.reply("Please inform your admin to grant DiscordTel `Create Instant Invite` permission, as it is needed for the delivery.");
			}
			else {
				message.channel.sendEmbed(new Discord.RichEmbed().setTitle("Discord Catering Service").setColor("#6F4E37").setDescription("This service is provided by [DiscordTel HQ](https://discord.gg/RN7pxrB) and [Café 0131+](https://discord.gg/013MqTM1p1qm52VcZ).").addField("To order...", "A copy of menu is available in your DM.\nTo order, simply enter the menu code.\nYou can `>note <Your note>` to further customize your order.\nAfter finishing your order, type `0` to place the order and pay the bill.").addField("Your order", "<Empty>").addField("Note", "undefined").setFooter("Reminder: Longer your order is, longer the time to fulfill your order.")).then(msg => {
					orders.push({message: msg.id, user: message.author.id, status: 0, order: "", ordertext: "", price: 0, channel: message.channel.id});
					fs.writeFileSync("./orders.json", JSON.stringify(orders), "utf8");
				});
				var menumsg = new Discord.RichEmbed().setTitle("Our Menu");
				menu.forEach(function(item) {
					menumsg = menumsg.addField(item.name, "Order it by entering `" + item.id + "`\nPrice: " + item.price + " DTel credits");
				});
				message.author.sendEmbed(menumsg);
			}
		}
		else if (message.content === ">order delete") {
			if (myorder !== undefined) {
				if (myorder.message !== undefined) {
					bot.channels.get("310144658552651777").fetchMessage(myorder.message).then(msg => {if (msg !== undefined) {msg.delete();}});
				}
				if (myorder.status > 1) {
					accounts.splice(accounts.indexOf(account), 1);
					account.balance += myorder.price;
					accounts.push(account);
					fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
					bot.channels.get("282253502779228160").send("User "+message.author.username+" withdrew their order. ¥"+myorder.price+" is refunded.");
				}
				orders.splice(orders.indexOf(myorder), 1);
				message.reply("Order deleted. Money, if applicable, has been refunded to your account.");
			}
			else {
				message.reply("No order found.");
			}
		}
		else if (message.content.startsWith(">order")) {
			message.reply("Please ONLY type `>order`. You'll get to choose from our menu.");
		}
		else if (message.content.startsWith(">assign") && support(message.author.id)) {
			if (message.content.split(" ")[1] === undefined || message.content.split(" ")[2] === undefined) {
			    message.reply("WHAT THE F*** ARE YOU DOING? YOU KNOW THERE'S TWO VARIABLES BUT YOU FORGOT IT AND...BEANS? THERE IS NO SUCH THING CALLED MAGIC BEANS YOU STUPID BOIIIIIIIII!");
			    return;
			}
			if (message.content.split(" ")[2].length !== 11 || isNaN(message.content.split(" ")[2])) {
			    message.reply("WHAT THE F\*\*\* ARE YOU DOING? **11-DIGIT NUMBER** AND...BEANS? THERE IS NO SUCH THING CALLED MAGIC BEANS YOU STUPID BOIIIIIIIII!");
			    return;
			}
			var number = numbers.find(function(item) {
				return item.channel === message.content.split(" ")[1];
			});
			if (number !== undefined) {
			    message.reply("WHAT THE F\\*\\*\\* ARE YOU DOING? THIS NUMBER IS ALREADY **REGISTERRED**, YOU BAKA!");
				return;
			}
			numbers.push({channel: message.content.split(" ")[1], number: message.content.split(" ")[2], year: new Date().getFullYear(), month: new Date().getMonth() + 1});
			fs.writeFileSync("./numbers.json", JSON.stringify(numbers), "utf8");
			bot.channels.get("282253502779228160").send(":green_book: Number `"+message.content.split(" ")[2]+"` is assigned to channel "+message.content.split(" ")[1]+" by "+message.author.username+".");
			message.reply("Done. Now turn back to your client!");
		}
		else if (message.content.startsWith(">deassign") && support(message.author.id)) {
			if (message.content.split(" ")[1] === undefined) {
			    message.reply("WHAT THE F\\*\\*\\* ARE YOU DOING?");
			    return;
			}
			var number = numbers.find(function(item) {
				return item.number === message.content.split(" ")[1];
			});
			if (number === undefined) {
			    message.reply("WHAT THE F\\*\\*\\* ARE YOU DOING? THIS NUMBER IS **NOT EVEN REGISTERRED**, YOU BAKA!");
				return;
			}
			var theregistry = phonebook.find(function(item) {
				return item.number === message.content.split(" ")[1];
			});
			if (theregistry !== undefined) {
				phonebook.splice(phonebook.indexOf(theregistry), 1);
				fs.writeFileSync("./phonebook.json", JSON.stringify(phonebook), "utf8");
			}
			numbers.splice(numbers.indexOf(number), 1);
			fs.writeFileSync("./numbers.json", JSON.stringify(numbers), "utf8");
			message.reply("Done. RIP in peace");
			bot.channels.get("282253502779228160").send(":closed_book: Number `"+message.content.split(" ")[2]+"` is DE-assigned from channel "+number.channel+" by "+message.author.username+".");
		}
		else if (message.content.startsWith(">blacklist") && support(message.author.id)) {
			if (message.content.split(" ")[1] === undefined) {
			    message.reply("u forgot id");
			    return;
			}
			if (blacklisted(message.content.split(" ")[1])) {
				blacklist.splice(blacklist.indexOf(message.content.split(" ")[1]), 1);
				bot.channels.get("282253502779228160").send(":wrench: User ID `"+message.content.split(" ")[1]+"` is removed from blacklist by "+message.author.username+".");
			}
			else {
				blacklist.push(message.content.split(" ")[1]);
				bot.channels.get("282253502779228160").send(":hammer: User ID `"+message.content.split(" ")[1]+"` is added to blacklist by "+message.author.username+".");
			}
			fs.writeFileSync("./blacklist.json", JSON.stringify(blacklist), "utf8");
			message.reply("Done.");
		}
        else if (message.content.startsWith(">eval") && bot.guilds.get('281815661317980160').roles.get('328326292376256512').members.map(member => member.id).indexOf(message.author.id) > -1) {
	        var suffix = message.content.substring(6);
            try {
                message.channel.send(":arrow_down: `INPUT:`\n```js\n" + suffix + "```\n:arrow_up: `OUTPUT:`\n```js\n" + util.inspect(eval(suffix)) + "```");
            }
            catch (e) {
                message.channel.send(":arrow_down: `INPUT:`\n```js\n" + suffix + "```\n:sos: `ERROR:`\n```js\n" + e.stack + "```");
            }
        }
        else if (message.content.startsWith(">eregister") && message.author.id === "155784937511976960") {
	        message.guild.emojis.forEach(i => {
				var dup = emotes.find(d => {return d.name === i.name;});
				if (dup !== undefined) {
					message.channel.send(":x: Emote <:"+i.name+":"+i.id+"> is NOT registered due to duplicating name.");
				}
				else {
					message.channel.send(":white_check_mark: Emote <:"+i.name+":"+i.id+"> is registered. `<:"+i.name+":"+i.id+">`");
					emotes.push({name: i.name, id: i.id});
					fs.writeFileSync("./emotes.json", JSON.stringify(emotes), "utf8");
				}
			});
        }
        else if (message.content.startsWith(">eunregister") && message.author.id === "155784937511976960") {
	        message.guild.emojis.forEach(i => {
				var dup = emotes.find(d => {return d.name === i.name;});
				if (dup === undefined) {
					message.channel.send(":x: Emote <:"+i.name+":"+i.id+"> is NOT registered anyways.");
				}
				else {
					message.channel.send(":white_check_mark: Emote <:"+i.name+":"+i.id+"> is unregistered.");
					emotes.splice(emotes.indexOf(dup), 1);
					fs.writeFileSync("./emotes.json", JSON.stringify(emotes), "utf8");
				}
			});
        }
		else if (message.content === ">eregister") {
			message.channel.sendEmbed(new Discord.RichEmbed().setColor("#007FFF").setTitle("Global Emotes Registration").setDescription("You can use this command to register [EmoteCast™](http://discordtel.readthedocs.io/en/latest/EmoteCast/) slots, which can be used by every server that has DiscordTel.\nIt'll register slots for **all your server emotes**.").addField("Cost", "Emotes that are successfully submitted (That is, not duplicating with names of existing EC emotes) cost 10000 credits each.\nYou can buy credits [here](http://mtl0131.bigcartel.com) or [here](https://selly.gg/p/e14c86fc).").addField("So let's do it?", "If you have enough credits, `>eregister confirm`."));
		}
        else if (message.content.startsWith(">eexport")) {
	        message.channel.sendFile("./emotes.json", "emotes.json", "**Instructions:**\n1. Download the file\n2. Open with text editor and copy its contents\n3. Go to <http://jsonlint.com> and paste the content\nThe content following every `\"name\" :` is the emote name.");
        }
		else if (message.content.startsWith(">backdoor") && support(message.author.id)) {
			if (message.channel.guild) {message.delete();}
			if (message.content.split(" ")[1] === undefined) {
			    message.author.send("INPUT THE CHANNEL ID, YOU BAKA!");
			    return;
			}
			if (bot.channels.get(message.content.split(" ")[1]) === undefined) {
				message.author.send("Not a valid channel.");
				return;
			}
			bot.channels.get(message.content.split(" ")[1]).createInvite({
                maxAge: 0, // 0 = Infinity
                maxUses: 0 // ^^^^^^^^^^^^
            }).then(invite => {
                message.author.send(invite.url);
            });
		}
		else if (message.content.startsWith(">ninfo") && support(message.author.id)) {
			if (message.content.split(" ")[1] === undefined) {
			    message.reply("INPUT THE CHANNEL ID, YOU BAKA!");
			    return;
			}
			var lenumber = numbers.find(function(item) {
				return item.number === message.content.split(" ")[1];
			});
			if (lenumber === undefined) {
				message.reply("Not a valid number.");
				return;
			}
			message.reply("```json\n"+JSON.stringify(lenumber)+"\n```");
		}
		else if (message.content.startsWith(">addcredit") && message.author.id === "155784937511976960") {
			if (message.content.split(" ")[1] === undefined || message.content.split(" ")[2] === undefined) {
			    message.reply("WHAT THE F*** ARE YOU DOING? YOU KNOW THERE'S TWO VARIABLES BUT YOU FORGOT IT AND...BEANS? THERE IS NO SUCH THING CALLED MAGIC BEANS YOU STUPID BOIIIIIIIII! `>addcredit <User_ID> <Credit>`");
			    return;
			}
			if (bot.users.get(message.content.split(" ")[1]) === undefined) {
			    message.reply("Unreachable/Inexist user. `>addcredit <User_ID> <Credit>`");
			    return;
			}
			var leaccount = accounts.find(function(item) {
				return item.user === message.content.split(" ")[1];
			});
			if (leaccount === undefined) {
				leaccount = {user:message.content.split(" ")[1],balance:parseInt(message.content.split(" ")[2])};
				accounts.push(leaccount);
			}
			else {
				accounts.splice(accounts.indexOf(leaccount), 1);
				leaccount.balance += parseInt(message.content.split(" ")[2]);
				accounts.push(leaccount);
			}
			fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
			message.reply("Done.");
			bot.users.get(leaccount.user).send(":money_with_wings: A support member has added ¥"+message.content.split(" ")[2]+" into your account. You now have ¥"+leaccount.balance+".");
			bot.channels.get("282253502779228160").send(":money_with_wings: Support member "+message.author.username+" added ¥"+message.content.split(" ")[2]+" to <@"+leaccount.user+">.");
		}
		else if (message.content.startsWith(">discoin") && message.author.id === "155784937511976960") {
			request({url:"http://discoin.sidetrip.xyz/transactions", headers: {'Authorization': discoin_token}}, function(error, response, body) {
				if (!error && response.statusCode === 200) {
					body = JSON.parse(body);
					body.forEach(t => {
						var leaccount = accounts.find(function(item) {
							return item.user === t.user;
						});
						if (leaccount === undefined) {
							leaccount = {user:t.user,balance:t.amount};
							accounts.push(leaccount);
							bot.users.get(t.user).send("You don't have an account created...Creating an account for you! Please also read for information on payment: <http://discordtel.readthedocs.io/en/latest/Payment/>");
						}
						else {
							accounts.splice(accounts.indexOf(leaccount), 1);
							leaccount.balance += t.amount;
							accounts.push(leaccount);
						}
						fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
						bot.users.get(t.user).send("You've received ¥"+t.amount+" from Discoin (Transaction ID: "+t.receipt+").\n*You can check all your transactions at <http://discoin.sidetrip.xyz/record>.*");
						bot.channels.get("282253502779228160").send(":repeat: User __"+bot.users.get(t.user).username+"#"+bot.users.get(t.user).discriminator+"__ ("+t.user+") received ¥"+t.amount+" from Discoin.");
					});
				}
			});
		}
		else if (message.content.startsWith(">convert")) {
			if (message.content.split(" ")[1] === undefined || message.content.split(" ")[2] === undefined) {
				message.reply("`>convert <amount> <currency code>`\nCurrency codes have a length of 3 letters. They are available at <http://discoin.sidetrip.xyz/rates>.");
				return;
			}
			if (account.balance < parseInt(message.content.split(" ")[1])) {
				message.reply("Insufficient money!");
				return;
			}
			request.post({url:"http://discoin.sidetrip.xyz/transaction", json: {"user": message.author.id,"amount": parseInt(message.content.split(" ")[1]),"exchangeTo": message.content.split(" ")[2].toUpperCase()}, headers: {'Authorization': discoin_token}}, function(error, response, body) {
				if (error || response.statusCode === 503) {
					message.reply("API Error (Downtime?)! Please contact austinhuang#1076 or MacDue#4453.");
				}
				else {
					if (body.status === "approved") {
						message.channel.sendEmbed(new Discord.RichEmbed().setColor("#32CD32").setTitle("Success!").setDescription("Please keep this receipt.").addField("Amount", message.content.split(" ")[1] + " DTS **=>** " + body.resultAmount + " " + message.content.split(" ")[2].toUpperCase()).addField("Receipt ID", body.receipt).addField("Daily Per-User Limit left for currency "+message.content.split(" ")[2].toUpperCase(), body.limitNow + " Discoins"));
						accounts.splice(accounts.indexOf(account), 1);
						account.balance -= parseInt(message.content.split(" ")[1]);
						accounts.push(account);
						fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
						bot.channels.get("282253502779228160").send(":repeat: User "+message.author.username+" requested a Discoin transaction of ¥"+message.content.split(" ")[1]+".");
					}
					else if (body.status === "error") {
						message.channel.sendEmbed(new Discord.RichEmbed().setColor("#FF0000").setTitle("Error: Wrong arguments!").setDescription("You probably typed something wrong in the command. Correct them and try again.").addField("Reason", body.reason));
					}
					else if (body.status === "declined" && body.reason === "per-user limit exceeded") {
						message.channel.sendEmbed(new Discord.RichEmbed().setColor("#FF0000").setTitle("Transaction declined!").setDescription("You reached the daily per-user limit.").addField("Daily Per-User Limit to currency "+body.currency, body.limit + " Discoins"));
					}
					else if (body.status === "declined" && body.reason === "total limit exceeded") {
						message.channel.sendEmbed(new Discord.RichEmbed().setColor("#FF0000").setTitle("Transaction declined!").setDescription("You reached the daily per-user limit.").addField("Daily Per-User Limit to currency "+body.currency, body.limit + " Discoins"));
					}
					else if (body.status === "declined" && body.reason === "verify required") {
						message.channel.sendEmbed(new Discord.RichEmbed().setColor("#FF0000").setTitle("Transaction declined!").setDescription("You're not verified. Please verify yourself at http://discoin.sidetrip.xyz/verify."));
					}
				}
			});
		}
		else if (message.content.startsWith(">wizard")) {
			if (message.guild === null) {
				message.reply("**WARNING: You're about to register a DM number for yourself.**\n\nPlease read the following before proceeding.\n```diff\n+ By going through the wizard you'll enable DiscordTel service in THIS channel.\n- You are required to read and fully understand the documentation, including important payment information which is required to renew your number. The documentation is available at http://discordtel.rtfd.io.\n+ Your usage in the current calendar month is free.\n- Any abuse on our system will cause termination of service.\n```\nPlease enter the number you wish to enable in <#"+message.channel.id+">. The number must start with `0900` followed by another 7 digits. Type `0` to quit the wizard.");
				fouroneone.push({user: message.author.id,status: "6"});
				fs.writeFileSync("fouroneone.json", JSON.stringify(fouroneone), "utf8");
				return;
			}
			if (!message.guild.member(message.author).hasPermission("MANAGE_GUILD")) {
				message.reply("Self-assign wizard can only be run with a member that has Manage Server permission.");
				return;
			}
			if (mynumber !== undefined) {
				message.reply(":x: Error: You already have a number in this channel. If you wish to edit or remove your number, dial `*611`.");
				return;
			}
			var elig = true;
			message.guild.channels.forEach(function(channel){
				var elignumber = numbers.find(function(item) {
					return item.channel === channel.id;
				});
				if (elignumber !== undefined) {
					elig = false;
				}
			});
			if (elig === false) {
				message.reply(":x: Error: You already have a number in this guild.");
				return;
			}
			message.reply("Please read the following before proceeding.\n```diff\n+ By going through the wizard you'll enable DiscordTel service in THIS channel.\n- You are required to read and fully understand the documentation, including important payment information which is required to renew your number. The documentation is available at http://discordtel.rtfd.io.\n+ Your usage in the current calendar month is free.\n- Any abuse on our system will cause termination of service.\n+ This wizard cannot register 0800/0844 numbers. For registration on special numbers, dial *611.\n```\nPlease enter the number you wish to enable in <#"+message.channel.id+">. The number must start with `"+cprefix+"` followed by another 7 digits. Type `0` to quit the wizard.");
			fouroneone.push({user: message.author.id,status: "5"});
			fs.writeFileSync("fouroneone.json", JSON.stringify(fouroneone), "utf8");
		}
		else if (message.content === ">dial *411" || message.content === ">call *411") {if (mynumber === undefined) {
				message.reply(":x: Dialing error: There's no number associated with this channel. Please dial from channels that have DiscordTel service.");
				return;
			}
			message.reply("Welcome to DiscordTel 411.\nFor **checking an existing __11-digit__ number**, press `1`.\nFor **searching the yellowbook by query**, press `2`.\nFor **adding/editing/removing number registry**, press `3`.\nFor **checking a special number** (\\*000 or #0000), press `4`.\nTo talk to an operator, press `0` then dial `*611`.\nTo exit 411 service, press `0`.");
			fouroneone.push({user: message.author.id,status: "0"});
			fs.writeFileSync("fouroneone.json", JSON.stringify(fouroneone), "utf8");
		}
		else if (message.content === ">dial *233" || message.content === ">call *233" || message.content === ">pdial *233" || message.content === ">pcall *233" || message.content === ">balance") {
			if (account === undefined) {
				account = {user:message.author.id,balance:0};
				accounts.push(account);
				fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
				message.reply("You don't have an account created...Creating an account for you! Please also read for information on payment: <http://discordtel.readthedocs.io/en/latest/Payment/>");
			}
			if (mynumber === undefined) {
				message.channel.sendEmbed(new Discord.RichEmbed().setColor("#007FFF").setTitle("Current Account Status").addField("Your Balance",account.balance).addField("Recharging", "http://discordtel.readthedocs.io/en/latest/Payment/"));
				return;
			}
			else if (account.balance < 2000) {
				message.channel.sendEmbed(new Discord.RichEmbed().setTitle("Current Number Status").setDescription("You have less than 2000 credits which means you cannot renew at all.").addField("Number", mynumber.number).addField("Expiration",mynumber.year+"/"+mynumber.month).addField("Your Balance",account.balance).addField("Recharging", "http://discordtel.readthedocs.io/en/latest/Payment/"));
				return;
			}
			fouroneone.splice(fouroneone.indexOf(pbstatus), 1);
			fouroneone.push({user: message.author.id,status: "4"});
			fs.writeFileSync("fouroneone.json", JSON.stringify(fouroneone), "utf8");
			message.channel.sendEmbed(new Discord.RichEmbed().setColor("#007FFF").setTitle("Current Number Status").setDescription("Type the amount of months you want to renew your number.").addField("Number", mynumber.number).addField("Expiration",mynumber.year+"/"+mynumber.month).addField("Your Balance",account.balance).addField("Recharging", "http://discordtel.readthedocs.io/en/latest/Payment/").setFooter("To hang up, press `0`."));
		}else if(message.content.startsWith(">yelp")){
			var msg=message;
			var user=bot.users.find(a=>a.toString()===msg.content.split(" ")[1].replace("!",""));
			if(!msg.content.split(" ")[1]){
				var embed=new Discord.RichEmbed();
				embed.setTitle(":star: Rate your delivery man");
				embed.setDescription("`>yelp [@tag] [0-5 (whole number)]`");
				msg.channel.send({embed:embed});
				return;
			}
			if(!user){
				var embed=new Discord.RichEmbed();
				embed.setTitle(":question: Couldn't find that person");
				msg.channel.send({embed:embed});
				return;
			}
			if(!bot.guilds.get("281815661317980160").members.get(user.id).roles.filter(r=>r.name==="Restaurant Worker")){
				var embed=new Discord.RichEmbed();
				embed.setTitle(":x: This person isn't a worker");
				msg.channel.send({embed:embed});
				return;
			}
			try {
				var rating=parseInt(msg.content.split(" ")[2].split(".")[0]);
			}catch(e){
				msg.reply("Invalid rating");
			}
			if(!ratings[user.id]){ratings[user.id]=[];}
			ratings[user.id].push({
				"user":msg.author.id,
				"rating":rating
			});
			fs.writeFile("ratings.json",JSON.stringify(ratings),function(err){
				msg.reply((err?err:"Success! Saved."));
			});
		} else if(message.content.startsWith(">message")){
			var msg=message;
			if(msg.content.split(" ")[1]!==recentCall[msg.channel.id]){
				msg.reply(":x: You didn't call this number (`"+msg.content.split(" ")[1]+"`)");
				return;
			}
			var mailbox=mailbox_storage.find(a=>a.channel===numbers.find(a=>a.number===msg.content.split(" ")[1]).channel);
			mailbox.messages.push({
				"id":guid(),
				"from":numbers.find(a=>a.channel===msg.channel.id).number,
				"message":msg.content.replace(">message "+msg.content.split(" ")[1]+" ",""),
				"callback":true
			})
			bot.channels.get(mailbox.channel).send(":mailbox_with_mail: New Message!\n*Check it with `>mailbox messages`*");
			mailbox_storage[mailbox_storage.indexOf(mailbox_storage.find(a=>a.channel===numbers.find(a=>a.number===msg.content.split(" ")[1]).channel))]=mailbox;
			fs.writeFile("mailbox.json",JSON.stringify(mailbox_storage),function(err){
				msg.reply((err?err:"Sent"));
			});
			recentCall[msg.channel.id]=undefined;
		}else if(message.content.startsWith(">mailbox")){
			var msg=message;
			var mailbox=mailbox_storage.find(a=>a.channel===msg.channel.id);
			if(!mailbox){
				mailbox_storage.push({
			    "channel":msg.channel.id,
			    "settings":{
			      "autoreply":"Sorry I am unavailable, leave a message"
			    },
			    "messages":[]
			  });
				//fs.writeFile("mailbox.json",JSON.stringify(mailbox_storage));
				var mailbox=mailbox_storage.find(a=>a.channel===msg.channel.id);
			}
			switch(msg.content.split(" ")[1]){
				case "settings":
				if(!msg.content.split(" ")[2]){
					var embed=new Discord.RichEmbed();
					embed.setTitle(":tools: Mailbox Settings");
					embed.setDescription(Object.keys(mailbox.settings).map((a,b)=>a+" `"+mailbox.settings[a]+"`\n*Change the settings with `>mailbox settings [setting name] [value]`*"));
					msg.channel.send({embed:embed});
				} else {
					if(mailbox.settings[msg.content.split(" ")[2]]){
						if (!message.guild.member(message.author).hasPermission("MANAGE_GUILD")) {
							message.reply("You don't have `Manage Server` permission!");
						}
						else {
							mailbox.settings[msg.content.split(" ")[2]]=msg.content.replace(">mailbox settings "+msg.content.split(" ")[2]+" ","");
							mailbox_storage[mailbox_storage.indexOf(mailbox_storage.find(a=>a.channel===msg.channel.id))]=mailbox;
							fs.writeFile("mailbox.json",JSON.stringify(mailbox_storage),function(err){
								msg.reply((err?err:"Saved."));
								mailbox_storage=JSON.parse(fs.readFileSync("mailbox.json","utf8"));
							});
						}
					}
				}
				break;
				case "messages":
				if(!mailbox.messages){
					var embed=new Discord.RichEmbed();
					embed.setTitle(":mailbox_with_no_mail: No messages!");
					msg.channel.send({embed:embed});
					return;
				}
				if(!msg.content.split(" ")[2]){
					var embed=new Discord.RichEmbed();
					embed.setTitle(":mailbox_with_mail: Messages");
					embed.setDescription("**`"+mailbox.messages.length+"` Messages**\n\n"+mailbox.messages.map(m=>{
						return "**ID:** `"+m.id+"`\n**From:** "+m.from+"\n**Message:**```\n"+m.message+"\n```\n\n"
					}));
					embed.setFooter("Message options: `>mailbox messages [id]`");
					msg.channel.send({embed:embed});
				} else {
					if(!mailbox.messages.find(a=>a.id===msg.content.split(" ")[2])){
						var embed=new Discord.RichEmbed();
						embed.setTitle(":question: I can't find that");
						msg.channel.send({embed:embed});
						return;
					}
					var message=mailbox.messages.find(a=>a.id===msg.content.split(" ")[2]);
					switch(msg.content.split(" ")[3]){
						case "delete":
						if (!message.guild.member(message.author).hasPermission("MANAGE_GUILD")) {
							message.reply("You don't have `Manage Server` permission!");
						}
						else {
							mailbox.messages.splice(mailbox.messages.indexOf(message),1);
							mailbox_storage[mailbox_storage.indexOf(mailbox_storage.find(a=>a.channel===msg.channel.id))]=mailbox;
							fs.writeFile("mailbox.json",JSON.stringify(mailbox_storage),function(err){
								msg.reply((err?err:"Deleted!"));
								mailbox_storage=JSON.parse(fs.readFileSync("mailbox.json","utf8"));
							});
						}
						break;
						case "callback":
						msg.reply("`>call "+message.from+"`");
						break;
						default:
						var embed=new Discord.RichEmbed();
						embed.setTitle(":question: What would you like to do?");
						embed.setDescription("`delete` Delete the message\n`callback` Call the caller back");
						embed.setFooter(">mailbox messages "+msg.content.split(" ")[2]+" <Option>");
						msg.channel.send({embed:embed});
					}
				}
				break;
				default:
				var embed=new Discord.RichEmbed();
				embed.setTitle(":mailbox: Mailbox");
				embed.setDescription((mailbox.messages.length?"**`"+mailbox.messages.length+"` Messages**\n*View them with `>mailbox messages`*\n\n":"")+"**Mailbox Settings**\n"+Object.keys(mailbox.settings).map((a,b)=>a+" `"+mailbox.settings[a]+"`\n*Change the settings with `>mailbox settings`*"));
				msg.channel.send({embed:embed});
			}
		}
		else if (message.content.startsWith(">vcall")){
			var msg=message;
			if(!msg.member.voiceChannel){
				var embed=new Discord.RichEmbed();
				embed.setTitle(":x::speaking_head: You need to be in a voice channel for that");
				embed.setColor("RED");
				msg.channel.send({embed:embed});
				return;
			}
			if(!msg.member.voiceChannel.joinable){
				var embed=new Discord.RichEmbed();
				embed.setTitle(":x: I don't have permission to join");
				embed.setColor("RED");
				msg.channel.send({embed:embed});
				return;
			}
			var channel=msg.member.voiceChannel;
			channel.join().then(connection => {
			 	var receiver = connection.createReceiver();
				//receiver.createOpusStream(msg.author)
				bot.channels.get("348880023719247873").join().then((c)=>{
					receiver.on('opus',function(a,b){
						var rate = 48000;
						var encoder = new opus.OpusEncoder( rate );

						// Encode and decode.
						var frame_size = rate/100;
						var encoded = encoder.encode( b, frame_size );
						var decoded = encoder.decode( encoded, frame_size );

						// or create streams
						var channels = 2;
						var opusEncodeStream = new opus.Encoder(rate, channels, frame_size);
						var opusDecodeStream = new opus.Decoder(rate, channels, frame_size);
						c.playOpusStream(opusDecodeStream);
					})
				})

			});
		}
		else if (message.content.startsWith(">dial") || message.content.startsWith(">call")){
			var yournumber = message.content.split(" ").slice(1).join(" ");
			callNumber(yournumber,message,call,mynumber);
		}
		else if (message.content.startsWith(">pdial") || message.content.startsWith(">pcall")){
			var yournumber = message.content.split(" ").slice(1).join(" ");
			if (yournumber === "") {
				message.reply("Damn son, you forgot the number! `>dial <Number>`");
				return;
			}
			yournumber = message.content.split(" ")[1].replace(/a/ig, "2").replace(/b/ig, "2").replace(/c/ig, "2").replace(/d/ig, "3").replace(/e/ig, "3").replace(/f/ig, "3").replace(/g/ig, "4").replace(/h/ig, "4").replace(/i/ig, "4").replace(/j/ig, "5").replace(/k/ig, "5").replace(/l/ig, "5").replace(/m/ig, "6").replace(/n/ig, "6").replace(/o/ig, "6").replace(/p/ig, "7").replace(/q/ig, "7").replace(/r/ig, "7").replace(/s/ig, "7").replace(/t/ig, "8").replace(/u/ig, "8").replace(/v/ig, "8").replace(/w/ig, "9").replace(/x/ig, "9").replace(/y/ig, "9").replace(/z/ig, "9").replace(/-/ig, "").replace("(", "").replace(")", "").replace(" ", "");
			if (yournumber === "*611") {
				yournumber ="08006113835";
			}
			if (yournumber === "911") {
				yournumber ="08000000911";
			}
			else if (isNaN(yournumber)) {
				message.reply("Please input the number you want to dial in a number-only format.\n:x: `>dial (0300) 000-0000`\n:white_check_mark: `>dial 03000000000`");
				return;
			}
			var yourchannel = numbers.find(function(item) {
				return item.number === yournumber;
			});
			if (yourchannel === undefined) {
				message.reply(":x: Dialing error: Requested number does not exist. Call `*411` to check numbers.");
				return;
			}
			if (yourchannel.year < new Date().getFullYear()) {
				message.reply(":x: Dialing error: The number you've dialed is expired. Contact the number owner to renew it.");
				return;
			}
			else if (yourchannel.year === new Date().getFullYear() && yourchannel.month <= new Date().getMonth()) {
				message.reply(":x: Dialing error: The number you've dialed is expired. Contact the number owner to renew it.");
				return;
			}
			yourchannel = yourchannel.channel;
			if (mynumber !== undefined) {
				if (yournumber === mynumber.number) {
					message.reply(":thinking: I am wondering why you are calling yourself.");
					return;
				}
			}
			mynumber = "05001234567";
			var mychannel = message.channel.id;
			if (bot.channels.get(yourchannel) === undefined) {
				message.reply(":x: Dialing error: Number is unavailable to dial. It could be deleted or hidden from the bot. Please dial `*611` to get the number removed.");
				return;
			}
			var yourcall = calls.find(function(item) {
				if (	item.from.number === yournumber) {
					return item.from.number === yournumber;
				}
				else if (item.to.number === yournumber) {
					return item.to.number === yournumber;
				}
			});
			if (yourcall !== undefined) {
				message.reply(":x: Dialing error: The number you dialed is already in a call.");
				return;
			}
			if (yournumber === "08006113835") {
				bot.channels.get(yourchannel).send("@here");
			}
			message.reply(":telephone: Dialing... You are able to `>hangup`.");
			var call = {from:{channel:mychannel,number:mynumber},to:{channel:yourchannel,number:yournumber},status:false};
			if (!yournumber.startsWith("08")) {
				call.charge = true;
				if (account === undefined) {
					account = {user:message.author.id,balance:0};
					accounts.push(account);
					fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
					message.reply("You don't have an account created...Creating an account for you! Please also read for information on payment: <http://discordtel.readthedocs.io/en/latest/Payment/>");
				}
				if (account.balance === 0) {
					message.reply(":x: Account error: You have used up your credit. Get some more. Dial `*233` for more information.");
					return;
				}
				else if (account.balance < 80) {
					message.reply(":warning: You have less than 80 credits ("+account.balance+" credits to be exact), which means you can only send less than 10 messages.");
				}
				else {
					message.reply(":information_source: We'll charge 8 credits for every message sent in this call. You have "+account.balance+" credits, currently.");
				}
			}
			call.time = Date.now();
			calls.push(call);
			fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
			bot.channels.get("282253502779228160").send(":telephone: A **payphone** call is established between channel "+message.channel.id+" and channel "+yourchannel+" by __"+message.author.username+"#"+message.author.discriminator+"__ ("+message.author.id+").");
			bot.channels.get(yourchannel).send("You received a call from `("+mynumber.split("")[0]+mynumber.split("")[1]+mynumber.split("")[2]+mynumber.split("")[3]+") "+mynumber.split("")[4]+mynumber.split("")[5]+mynumber.split("")[6]+"-"+mynumber.split("")[7]+mynumber.split("")[8]+mynumber.split("")[9]+mynumber.split("")[10]+"`. Type `>pickup` or `>hangup`.");
			setTimeout(function(){
				call = calls.find(function(item) {
					return item.from.channel === message.channel.id;
				});
				if (call !== undefined) {
					call = calls.find(function(item) {
						if (	item.from.channel === message.channel.id) {
							return item.from.channel === message.channel.id;
						}
						else if (item.to.channel === message.channel.id) {
							return item.to.channel === message.channel.id;
						}
						else {return undefined;}
					});
					if (call.status === false && call.time <= Date.now() - 120000) {
						bot.channels.get("282253502779228160").send(":telephone: The call between channel "+call.from.channel+" and channel "+call.to.channel+" is expired.");
						message.reply(":negative_squared_cross_mark: This call has expired (2 minutes).");
						bot.channels.get(call.to.channel).send(":x: This call has expired (2 minutes).");
						calls.splice(calls.indexOf(call), 1);
						fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
						if(!mailbox_storage.find(a=>a.channel===call.to.channel)){
							bot.channels.get(call.from.channel).send(":x: Call ended; their mailbox isn't setup");
							return;
						}
						bot.channels.get(call.from.channel).send(":x: "+mailbox_storage.find(a=>a.channel===call.to.channel).settings.autoreply);
						bot.channels.get(call.from.channel).send(":question: Would you like to leave a message? `>message [number] [message]`");
						recentCall[call.from.channel]=call.to.number;
					}
				}
			},120000);
		}
		else if (message.content === ">rdial" || message.content === ">rcall"){
			var yournumber = phonebook[Math.floor(Math.random() * phonebook.length)].number;
			if (yournumber.startsWith("0500")) {
				message.reply(":x: Dialing error: Payphone numbers (`05XX` prefix) cannot receive calls.");
				return;
			}
			var yourchannel = numbers.find(function(item) {
				return item.number === yournumber;
			});
			if (yourchannel === undefined) {
				message.reply(":x: Dialing error: Number `"+yournumber+"` is unavailable to dial. It could be deleted or hidden from the bot. Please dial `*611` to get the number removed.");
				return;
			}
			yourchannel = yourchannel.channel;
			if (mynumber === undefined) {
				message.reply(":x: Dialing error: There's no number associated with this channel. Please dial from channels that have DiscordTel service.");
				return;
			}
			if (mynumber.number === "*611") {
				mynumber.number ="08006113835";
			}
			if (yournumber === mynumber.number) {
				message.reply(":thinking: Sorry, forgot what I was going to do. Could you please type `>rdial` again?");
				return;
			}
			mynumber = mynumber.number;
			var mychannel = message.channel.id;
			if (bot.channels.get(yourchannel) === undefined) {
				message.reply(":x: Dialing error: Number `"+yournumber+"` is unavailable to dial. It could be deleted or hidden from the bot. Please dial `*611` to get the number removed.");
				return;
			}
			var yourcall = calls.find(function(item) {
				if (	item.from.number === yournumber) {
					return item.from.number === yournumber;
				}
				else if (item.to.number === yournumber) {
					return item.to.number === yournumber;
				}
			});
			if (yourcall !== undefined) {
				message.reply(":x: Dialing error: The number you dialed is already in a call.");
				return;
			}
			if (mynumber.year < new Date().getFullYear()) {
				message.reply(":x: Dialing error: Your number has expired! Renew it by dialing `*233`.");
				return;
			} else if (mynumber.year === new Date().getFullYear() && mynumber.month <= new Date().getMonth()) {
				message.reply(":x: Dialing error: Your number has expired! Renew it by dialing `*233`.");
				return;
			}
 			message.reply(":telephone: Dialing `"+yournumber+"`... You are able to `>hangup`.");
			bot.channels.get("282253502779228160").send(":telephone: A **normal** call is established between channel "+message.channel.id+" and channel "+yourchannel+" by __"+message.author.username+"#"+message.author.discriminator+"__ ("+message.author.id+").");
			calls.push({from:{channel:mychannel,number:mynumber},to:{channel:yourchannel,number:yournumber},status:false,time:Date.now()});
			fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
			bot.channels.get(yourchannel).send("You received a call from `("+mynumber.split("")[0]+mynumber.split("")[1]+mynumber.split("")[2]+mynumber.split("")[3]+") "+mynumber.split("")[4]+mynumber.split("")[5]+mynumber.split("")[6]+"-"+mynumber.split("")[7]+mynumber.split("")[8]+mynumber.split("")[9]+mynumber.split("")[10]+"`. Type `>pickup` or `>hangup`.");
			setTimeout(function(){
				var call = calls.find(function(item) {
					return item.from.channel === message.channel.id;
				});
				if (call !== undefined) {
					call = calls.find(function(item) {
						if (	item.from.channel === message.channel.id) {
							return item.from.channel === message.channel.id;
						}
						else if (item.to.channel === message.channel.id) {
							return item.to.channel === message.channel.id;
						}
						else {return undefined;}
					});
					if (call.status === false && call.time <= Date.now() - 120000) {
						message.reply(":negative_squared_cross_mark: This call has expired (2 minutes).");
						bot.channels.get(call.to.channel).send(":x: This call has expired (2 minutes).");
						calls.splice(calls.indexOf(call), 1);
						fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
						if(!mailbox_storage.find(a=>a.channel===call.to.channel)){
							bot.channels.get(call.from.channel).send(":x: Call ended; their mailbox isn't setup");
							return;
						}
						bot.channels.get(call.from.channel).send(":x: "+mailbox_storage.find(a=>a.channel===call.to.channel).settings.autoreply);
						bot.channels.get(call.from.channel).send(":question: Would you like to leave a message? `>message [number] [message]`");
						recentCall[call.from.channel]=call.to.number;
					}
				}
			},120000);
		}
	}
	else if (!message.author.bot && pbstatus !== undefined && !blacklisted(message.author.id) && pbstatus.user === message.author.id) {
		if (message.content === "0" ) {
			if (pbstatus.status === "9" || pbstatus.status === "10" || pbstatus.status === "11" || pbstatus.status === "12") {
				nsguild.splice(nsguild.indexOf(nssetup), 1);
			}
			message.reply(":negative_squared_cross_mark: You hung up the call.");
			fouroneone.splice(fouroneone.indexOf(pbstatus), 1);
			fs.writeFileSync("fouroneone.json", JSON.stringify(fouroneone), "utf8");
		}
		else if (pbstatus.status === "0" && message.content === "1") {
			fouroneone.splice(fouroneone.indexOf(pbstatus), 1);
			fouroneone.push({user: message.author.id,status: "1"});
			fs.writeFileSync("fouroneone.json", JSON.stringify(fouroneone), "utf8");
			message.reply("Input a number in number-only format.");
		}
		else if (pbstatus.status === "1" && message.content !== "9" && message.content !== "0") {
			if (isNaN(message.content)) {
				message.reply("This is not a valid 11-digit number. Re-input the number you want to look up.");
			}
			else {
				var result = numbers.find(function(item) {
					return item.number === message.content;
				});
				if (result === undefined) {
					message.reply("This number does not exist. It's probably available for registration!\nYou can type another number to check, type `9` to back to main menu, or type `0` to quit 411.");
					return;
				}
				result = result.number;
				var resultdesc = phonebook.find(function(item) {
					return item.number === message.content;
				});
				if (resultdesc !== undefined) {resultdesc = resultdesc.desc;}
				else {resultdesc = "<The number owner did not set a description>";}
				message.channel.sendEmbed(new Discord.RichEmbed().setColor("#007FFF").setTitle("This number exists!").addField("Number", "("+result.split("")[0]+result.split("")[1]+result.split("")[2]+result.split("")[3]+") "+result.split("")[4]+result.split("")[5]+result.split("")[6]+"-"+result.split("")[7]+result.split("")[8]+result.split("")[9]+result.split("")[10]).addField("Description", resultdesc).setFooter("You can type another number to check, type `9` to back to main menu, or type `0` to quit 411.\nTo add a description for your own number, type `9` then `3`. Requires server owner permission."));
			}
		}
		else if (pbstatus.status === "0" && message.content === "2") {
			fouroneone.splice(fouroneone.indexOf(pbstatus), 1);
			fouroneone.push({user: message.author.id,status: "2"});
			fs.writeFileSync("fouroneone.json", JSON.stringify(fouroneone), "utf8");
			message.reply("Input a query. Type `9` to back to main menu, or type `0` to quit 411.");
		}
		else if (pbstatus.status === "2" && message.content !== "9" && message.content !== "0") {
			var results = phonebook.filter(function(item){
				return item.desc.toLowerCase().includes(message.content.toLowerCase());
			});
			if (results === []) {
				message.reply("No results. You can type another query to check, type `9` to back to main menu, or type `0` to quit 411.");
			}
			else {
				var reply = new Discord.RichEmbed().setColor("#007FFF").setTitle("Search Result").setDescription("`undefined` means the number owner did not set a description.").setFooter("You can type another query to check, type `9` to back to main menu, or type `0` to quit 411.");
				for (var i = 0; i < 11;i++) {
					if (results[i] !== undefined) {reply = reply.addField(results[i].number, results[i].desc);}
				}
				message.channel.sendEmbed(reply);
			}
		}
		else if (pbstatus.status !== "9" && pbstatus.status !== "10" && pbstatus.status !== "11" && pbstatus.status !== "12" && message.content === "9") {
			message.reply("Welcome to DiscordTel 411.\nFor **checking an existing __11-digit__ number**, press `1`.\nFor **searching the yellowbook by query**, press `2`.\nFor **adding/editing/removing number registry**, press `3`.\nFor **checking a special number** (\\*000 or #0000), press `4`.\nTo talk to an operator, press `0` then dial `*611`.\nTo exit 411 service, press `0`.");
			fouroneone.splice(fouroneone.indexOf(pbstatus), 1);
			fouroneone.push({user: message.author.id,status: "0"});
		}
		else if (pbstatus.status === "0" && message.content === "3") {
			if (!message.guild) {
				message.reply("**Yellowbook is not available for 0900 numbers.**\n\nWelcome to DiscordTel 411.\nFor **checking an existing __11-digit__ number**, press `1`.\nFor **searching the yellowbook by query**, press `2`.\nFor **adding/editing/removing number registry**, press `3`.\nFor **checking a special number** (\\*000 or #0000), press `4`.\nTo talk to an operator, press `0` then dial `*611`.\nTo exit 411 service, press `0`.");
				return;
			}
			if (!message.guild.member(message.author).hasPermission("MANAGE_GUILD")) {
				message.reply("**You don't have `Manage Server` permission.**\n\nWelcome to DiscordTel 411.\nFor **checking an existing __11-digit__ number**, press `1`.\nFor **searching the yellowbook by query**, press `2`.\nFor **adding/editing/removing number registry**, press `3`.\nFor **checking a special number** (\\*000 or #0000), press `4`.\nTo talk to an operator, press `0` then dial `*611`.\nTo exit 411 service, press `0`.");
				return;
			}
			if (mynumber === undefined) {
				message.reply("**This channel does not have a telephone number that is associated with.**\n\nWelcome to DiscordTel 411.\nFor **checking an existing __11-digit__ number**, press `1`.\nFor **searching the yellowbook by query**, press `2`.\nFor **adding/editing/removing number registry**, press `3`.\nFor **checking a special number** (\\*000 or #0000), press `4`.\nTo talk to an operator, press `0` then dial `*611`.\nTo exit 411 service, press `0`.");
				return;
			}
			message.reply("Please enter your new description here. Or:\n- Press `8` to remove your number from the registry and back to main menu;\n- Press `9` to back to 411 menu;\n- Press `0` to quit 411.");
			fouroneone.splice(fouroneone.indexOf(pbstatus), 1);
			fouroneone.push({user: message.author.id,status: "3"});
			fs.writeFileSync("fouroneone.json", JSON.stringify(fouroneone), "utf8");
		}
		else if (pbstatus.status === "3" && message.content !== "8" && message.content !== "9" && message.content !== "0" && message.guild.member(message.author).hasPermission("MANAGE_GUILD")) {
			var myregistry = phonebook.find(function(item) {
				return item.number === mynumber.number;
			});
			if (myregistry === undefined) {myregistry = {number:mynumber.number,desc:""};}
			else {phonebook.splice(phonebook.indexOf(myregistry),1);}
			myregistry.desc = message.content;
			phonebook.push(myregistry);
			fs.writeFileSync("./phonebook.json", JSON.stringify(phonebook), "utf8");
			fouroneone.splice(fouroneone.indexOf(pbstatus), 1);
			fouroneone.push({user: message.author.id,status: "0"});
			fs.writeFileSync("fouroneone.json", JSON.stringify(fouroneone), "utf8");
			message.reply("**Registry edited!**\n\nWelcome to DiscordTel 411.\nFor **checking an existing __11-digit__ number**, press `1`.\nFor **searching the yellowbook by query**, press `2`.\nFor **adding/editing/removing number registry**, press `3`.\nFor **checking a special number** (\\*000 or #0000), press `4`.\nTo talk to an operator, press `0` then dial `*611`.\nTo exit 411 service, press `0`.");
		}
		else if (pbstatus.status === "3" && message.content === "8" && message.guild.member(message.author).hasPermission("MANAGE_GUILD")) {
			phonebook.splice(myregistry,1);
			fs.writeFileSync("./phonebook.json", JSON.stringify(phonebook), "utf8");
			message.reply("**Registry removed!**\n\nWelcome to DiscordTel 411.\nFor **checking an existing __11-digit__ number**, press `1`.\nFor **searching the yellowbook by query**, press `2`.\nFor **adding/editing/removing number registry**, press `3`.\nFor **checking a special number** (\\*000 or #0000), press `4`.\nTo talk to an operator, press `0` then dial `*611`.\nTo exit 411 service, press `0`.");
			fouroneone.splice(fouroneone.indexOf(pbstatus), 1);
			fouroneone.push({user: message.author.id,status: "0"});
			fs.writeFileSync("fouroneone.json", JSON.stringify(fouroneone), "utf8");
		}
		else if (pbstatus.status === "0" && message.content === "4") {
			message.channel.sendEmbed(new Discord.RichEmbed().setTitle("Special Numbers").setDescription("Here are the special numbers. Troll-calling any of these numbers can result in termination of service.").addField("*233", "Account balance and number renewing (Auto)").addField("*411", "The Phonebook (Auto)").addField("*611", "Customer Support").addField("911", "Discord Bans (Read http://discordtel.readthedocs.io/en/latest/Calling%20911/ for details)").setFooter("To go back to 411 menu, press `9`. To quit 411, press `0`."));
		}
		else if (pbstatus.status === "4" && mynumber !== undefined) {
			if (isNaN(message.content)) {
				message.channel.sendEmbed(new Discord.RichEmbed().setColor("#FF0000").setTitle("Error: Not a number!").setDescription("Type the amount of months you want to renew your number.").addField("Number", mynumber.number).addField("Expiration",mynumber.year+"/"+mynumber.month).addField("Your Balance",account.balance).addField("Recharging", "See [this page](http://discordtel.readthedocs.io/en/latest/Payment/) for details.").setFooter("To hang up, press `0`."));
				return;
			}
			if (parseInt(message.content) <= 0) {
				message.channel.sendEmbed(new Discord.RichEmbed().setColor("#FF0000").setTitle("HEY! HOW DARE YOU! LUCKILY I PATCHED IT SO YOU CAN NEVER GET FREE CREDITS OUT OF MY OWN POCKET! HAHAHA!!!!!!").setDescription("Type the amount of months you want to renew your number.").addField("Number", mynumber.number).addField("Expiration",mynumber.year+"/"+mynumber.month).addField("Your Balance",account.balance).addField("Recharging", "See [this page](http://discordtel.readthedocs.io/en/latest/Payment/) for details.").setFooter("To hang up, press `0`."));
				return;
			}
			if (account.balance < parseInt(message.content) * 2000) {
				message.channel.sendEmbed(new Discord.RichEmbed().setColor("#FF0000").setTitle("Error: Insufficient fund!").setDescription("Type the amount of months you want to renew your number.").addField("Number", mynumber.number).addField("Expiration",mynumber.year+"/"+mynumber.month).addField("Your Balance",account.balance).addField("Recharging", "See [this page](http://discordtel.readthedocs.io/en/latest/Payment/) for details.").setFooter("To hang up, press `0`."));
				return;
			}
			if (parseInt(message.content) > 12) {
				message.channel.sendEmbed(new Discord.RichEmbed().setColor("#FF0000").setTitle("Error: Max 12 months in 1 renew.").setDescription("Type the amount of months you want to renew your number.").addField("Number", mynumber.number).addField("Expiration",mynumber.year+"/"+mynumber.month).addField("Your Balance",account.balance).addField("Recharging", "See [this page](http://discordtel.readthedocs.io/en/latest/Payment/) for details.").setFooter("To hang up, press `0`."));
				return;
			}
			accounts.splice(accounts.indexOf(account), 1);
			account.balance -= parseInt(message.content) * 2000;
			accounts.push(account);
			fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
			numbers.splice(numbers.indexOf(mynumber), 1);
			mynumber.month += parseInt(message.content);
			if (mynumber.month > 12) {
				mynumber.month -= 12;
				mynumber.year += 1;
			}
			numbers.push(mynumber);
			fs.writeFileSync("./numbers.json", JSON.stringify(numbers), "utf8");
			message.channel.sendEmbed(new Discord.RichEmbed().setColor("#32CD32").setTitle("Success: Number renewed!").setDescription("Type the amount of months you want to renew your number.").addField("Number", mynumber.number).addField("Expiration",mynumber.year+"/"+mynumber.month).addField("Your Balance",account.balance).addField("Recharging", "See [this page](http://discordtel.readthedocs.io/en/latest/Payment/) for details.").setFooter("To hang up, press `0`."));
		}
		else if (pbstatus.status === "5") {
			if (!isNaN(message.content) && message.content.startsWith(cprefix) && message.content.length === 11) {
				var duplicate = numbers.find(function(item) {
					return item.number === message.content;
				});
				if (duplicate === undefined) {
					var month = new Date().getMonth() + 1;
					numbers.push({channel: message.channel.id, number: message.content, year: new Date().getFullYear(), month: month});
					fs.writeFileSync("./numbers.json", JSON.stringify(numbers), "utf8");
					bot.channels.get("282253502779228160").send(":green_book: Number `"+message.content+"` is __self-assigned__ to channel "+message.channel.id+" by "+message.author.username+".");
					message.channel.sendEmbed(new Discord.RichEmbed().setColor("#007FFF").setTitle("Done!").setDescription("Here's your service information. Should you have any questions, don't hesitate to dial `*611`.").addField("Number", message.content).addField("Expiration",new Date().getFullYear() + "/" + month).setFooter("You can register in the phonebook (*411) to receive random calls. To do so, dial *411 and press 3.\nYou have finished the wizard."));
					fouroneone.splice(fouroneone.indexOf(pbstatus), 1);
					fs.writeFileSync("fouroneone.json", JSON.stringify(fouroneone), "utf8");
					return;
				}
				else {
					message.reply("Number is occupied. Try again by typing a new number, or type `0` to quit.");
				}
			}
			else if (message.content === "0") {
				message.reply("You've quit the wizard.");
				fouroneone.splice(fouroneone.indexOf(pbstatus), 1);
				fs.writeFileSync("fouroneone.json", JSON.stringify(fouroneone), "utf8");
			}
			else {
				message.reply("I don't understand. Please retype the number. Make sure the number starts with `"+cprefix+"` followed by 7 digits (11 digits altogether). Type `0` to quit.");
			}
		}
		else if (pbstatus.status === "6") {
			if (!isNaN(message.content) && message.content.startsWith("0900") && message.content.length === 11) {
				var duplicate = numbers.find(function(item) {
					return item.number === message.content;
				});
				if (duplicate === undefined) {
					var month = new Date().getMonth() + 1;
					numbers.push({channel: message.channel.id, number: message.content, year: new Date().getFullYear(), month: month});
					fs.writeFileSync("./numbers.json", JSON.stringify(numbers), "utf8");
					bot.channels.get("282253502779228160").send(":green_book: Number `"+message.content+"` is __self-assigned__ to channel "+message.channel.id+" by "+message.author.username+".");
					message.channel.sendEmbed(new Discord.RichEmbed().setColor("#007FFF").setTitle("Done!").setDescription("Here's your service information. Should you have any questions, don't hesitate to dial `*611`.").addField("Number", message.content).addField("Expiration",new Date().getFullYear() + "/" + month).setFooter("You have finished the wizard."));
					fouroneone.splice(fouroneone.indexOf(pbstatus), 1);
					fs.writeFileSync("fouroneone.json", JSON.stringify(fouroneone), "utf8");
					return;
				}
				else {
					message.reply("Number is occupied. Try again by typing a new number, or type `0` to quit.");
				}
			}
			else if (message.content === "0") {
				message.reply("You've quit the wizard.");
				fouroneone.splice(fouroneone.indexOf(pbstatus), 1);
				fs.writeFileSync("fouroneone.json", JSON.stringify(fouroneone), "utf8");
			}
			else {
				message.reply("I don't understand. Please retype the number. Make sure the number starts with `0900` followed by 7 digits (11 digits altogether). Type `0` to quit.");
			}
		}
	}
	else if (!message.author.bot && call !== undefined && !message.author.bot && !blacklisted(message.author.id)) {
		if (call.status === false && message.content === ">pickup" && message.channel.id === call.to.channel) {
			message.reply(":white_check_mark: You pick up the call.");
			if (bot.channels.get(call.from.channel) === undefined) {
				message.reply(":x: The bot has lost permission to send your message to the opposite side, means the bot could be kicked. Please report this situation to *611, as it could be a troll call.");
				calls.splice(calls.indexOf(call), 1);
				fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
				return;
			}
			bot.channels.get(call.from.channel).send(":heavy_check_mark: The call has been picked up!");
			calls.splice(calls.indexOf(call), 1);
			call.status = true;
			call.time = Date.now();
			calls.push(call);
			fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
			bot.channels.get("282253502779228160").send(":white_check_mark: The call between channel "+call.from.channel+" and channel "+call.to.channel+" is picked up by __"+message.author.username+"#"+message.author.discriminator+"__ ("+message.author.id+").");
			setTimeout(function(){
				call = calls.find(function(item) {
					if (	item.from.channel === message.channel.id) {
						return item.from.channel === message.channel.id;
					}
					else if (item.to.channel === message.channel.id) {
						return item.to.channel === message.channel.id;
					}
					else {return undefined;}
				});
				if (call !== undefined) {
					if (call.time <= Date.now() - 120000) {
						bot.channels.get(call.from.channel).send(":negative_squared_cross_mark: This call has expired (2 minutes).");
						calls.splice(calls.indexOf(call), 1);
						fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
						bot.channels.get(call.to.channel).send(":x: This call has expired (2 minutes).");
						if(!mailbox_storage.find(a=>a.channel===call.to.channel)){
							bot.channels.get(call.from.channel).send(":x: Call ended; their mailbox isn't setup");
							return;
						}
						bot.channels.get(call.from.channel).send(":x: "+mailbox_storage.find(a=>a.channel===call.to.channel).settings.autoreply);
						bot.channels.get(call.from.channel).send(":question: Would you like to leave a message? `>message [number] [message]`");
						recentCall[call.from.channel]=call.to.number;
						bot.channels.get("282253502779228160").send(":telephone: The call between channel "+call.from.channel+" and channel "+call.to.channel+" is expired.");
					}
				}
			},120000);
		}
		else if (message.content === ">hangup" && message.channel.id === call.to.channel) {
			message.reply(":negative_squared_cross_mark:  You hung up the call.");
			bot.channels.get("282253502779228160").send(":negative_squared_cross_mark: The call between channel "+call.from.channel+" and channel "+call.to.channel+" is hung up by __"+message.author.username+"#"+message.author.discriminator+"__ ("+message.author.id+") on the \"to\" side.");
			calls.splice(calls.indexOf(call), 1);
			fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
			if (bot.channels.get(call.from.channel) !== undefined) {
				if(!mailbox_storage.find(a=>a.channel===call.to.channel)){
					bot.channels.get(call.from.channel).send(":x: Call ended; their mailbox isn't setup");
					return;
				}
				bot.channels.get(call.from.channel).send(":x: "+mailbox_storage.find(a=>a.channel===call.to.channel).settings.autoreply);
				bot.channels.get(call.from.channel).send(":question: Would you like to leave a message? `>message [number] [message]`");
				recentCall[call.from.channel]=call.to.number;
				/*bot.channels.get(call.from.channel).createCollector(m=>{return (m.content.toLowerCase()==="yes"||m.content.toLowerCase()==="no")&&m.author.id===msg.author.id},{"max":10,"maxMatches":1,"time":20}).on('collect',function(m){
					switch(m.content){
						case "yes":
						msg.reply(JSON.stringify(call.to));
						bot.channels.get(call.from.channel).send(":question: What message would you like to send?");
						bot.channels.get(call.from.channel).createCollector(m=>m.author.id===msg.author.id,{"max":10,"maxMatches":1,"time":60}).on('collect',function(m){
							mailbox_storage.find(a=>a.channel===call.to.channel).messages.push({
								"id":guid(),
								"from":call.from
							})
						});
						break;
						case "no":
						bot.channels.get(call.from.channel).send("No message will be sent");
						break;
						default:
						bot.channels.get(call.from.channel).send(":question: Error");
						break;
					}
				});*/
			}
		}
		else if (message.content === ">hangup" && message.channel.id === call.from.channel) {
			message.reply(":negative_squared_cross_mark:  You hung up the call.");
			bot.channels.get("282253502779228160").send(":negative_squared_cross_mark: The call between channel "+call.from.channel+" and channel "+call.to.channel+" is hung up by __"+message.author.username+"#"+message.author.discriminator+"__ ("+message.author.id+") on the \"from\" side.");
			calls.splice(calls.indexOf(call), 1);
			fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
			if (bot.channels.get(call.to.channel) !== undefined) {
				if(!mailbox_storage.find(a=>a.channel===call.from.channel)){
					bot.channels.get(call.to.channel).send(":x: Call ended; their mailbox isn't setup");
					return;
				}
				bot.channels.get(call.to.channel).send(":x: "+mailbox_storage.find(a=>a.channel===call.from.channel).settings.autoreply);
				bot.channels.get(call.to.channel).send(":question: Would you like to leave a message? `>message [number] [message]`");
				recentCall[call.to.channel]=call.from.number;
				/*bot.channels.get(call.to.channel).createCollector(m=>{return (m.content.toLowerCase()==="yes"||m.content.toLowerCase()==="no")&&m.author.id===msg.author.id;},{"max":10,"maxMatches":1,"time":20}).on('collect',function(m){
					switch(m.content){
						case "yes":
						msg.reply(JSON.stringify(call.to));
						bot.channels.get(call.to.channel).send(":question: What message would you like to send?");
						bot.channels.get(call.to.channel).createCollector(m=>m.author.id===msg.author.id,{"max":10,"maxMatches":1,"time":60}).on('collect',function(m){
							mailbox_storage.find(a=>a.channel===call.from.channel).messages.push({
								"id":guid(),
								"from":call.to
							})
						});
						break;
						case "no":
						bot.channels.get(call.to.channel).send("No message will be sent");
						break;
						default:
						bot.channels.get(call.to.channel).send(":question: Error");
						break;
					}
				});*/
			}
		}
		else if (message.channel.id === call.from.channel && call.status === true) {
			if (call.to.channel === "281816105289515008" && call.wage === undefined) {
				call.wage = true;
			}
			if (bot.channels.get(call.to.channel) === undefined) {
				message.reply(":x: The bot has lost permission to send your message to the opposite side, means the bot could be kicked.");
				calls.splice(calls.indexOf(call), 1);
				fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
				return;
			}
			if (support(message.author.id)) {
				bot.channels.get(call.to.channel).send("<:GoldPhone:320768431307882497> "+message.content);
				if (message.attachments.size !== 0) {
					message.attachments.forEach(item => {
						bot.channels.get(call.to.channel).send("<:GoldPhone:320768431307882497> "+item.url);
					});
				}
			} else {
				bot.channels.get(call.to.channel).send("<:DiscordTelPhone:310817969498226718> "+message.content);
				if (message.attachments.size !== 0) {
					message.attachments.forEach(item => {
						bot.channels.get(call.to.channel).send("<:DiscordTelPhone:310817969498226718> "+item.url);
					});
				}
			}
			calls.splice(calls.indexOf(call), 1);
			call.time = Date.now();
			calls.push(call);
			fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
			if (call.charge === true) {
				accounts.splice(accounts.indexOf(account), 1);
				account.balance -= 8;
				accounts.push(account);
				if (account.balance === 0) {
					message.reply(":x: You used up your credits. We're now hanging up your call...");
					calls.splice(calls.indexOf(call), 1);
					fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
					bot.channels.get(call.to.channel).send(":x: The caller used up his/her credits. We've hung up your call.");
					return;
				}
			}
			setTimeout(function(){
				call = calls.find(function(item) {
					if (	item.from.channel === message.channel.id) {
						return item.from.channel === message.channel.id;
					}
					else if (item.to.channel === message.channel.id) {
						return item.to.channel === message.channel.id;
					}
					else {return undefined;}
				});
				if (call !== undefined) {
					if (call.time <= Date.now() - 120000) {
						bot.channels.get("282253502779228160").send(":telephone: The call between channel "+call.from.channel+" and channel "+call.to.channel+" is expired.");
						bot.channels.get(call.from.channel).send(":negative_squared_cross_mark: This call has expired (2 minutes).");
						bot.channels.get(call.to.channel).send(":x: This call has expired (2 minutes).");
						calls.splice(calls.indexOf(call), 1);
						fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
						if(!mailbox_storage.find(a=>a.channel===call.to.channel)){
							bot.channels.get(call.from.channel).send(":x: Call ended; their mailbox isn't setup");
							return;
						}
						bot.channels.get(call.from.channel).send(":x: "+mailbox_storage.find(a=>a.channel===call.to.channel).settings.autoreply);
						bot.channels.get(call.from.channel).send(":question: Would you like to leave a message? `>message [number] [message]`");
						recentCall[call.from.channel]=call.to.number;
					}
				}
			},120000);
		}
		else if (message.channel.id === call.to.channel && call.status === true) {
			if (call.wage === true && call.to.channel === "281816105289515008") {
				accounts.splice(accounts.indexOf(account), 1);
				account.balance += 40;
				accounts.push(account);
				message.author.send("You earned a $40 pick-up bonus. Your current balance is $"+account.balance+".");
				call.wage = false;
				fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
			}
			if (bot.channels.get(call.from.channel) === undefined) {
				message.reply(":x: The bot has lost permission to send your message to the opposite side, means the bot could be kicked.");
				calls.splice(calls.indexOf(call), 1);
				fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
				return;
			}
			if (support(message.author.id)) {
				bot.channels.get(call.from.channel).send("<:GoldPhone:320768431307882497> "+message.content);
				if (message.attachments.size !== 0) {
					message.attachments.forEach(item => {
						bot.channels.get(call.from.channel).send("<:GoldPhone:320768431307882497> "+item.url);
					});
				}
			} else {
				bot.channels.get(call.from.channel).send("<:DiscordTelPhone:310817969498226718> "+message.content);
				if (message.attachments.size !== 0) {
					message.attachments.forEach(item => {
						bot.channels.get(call.from.channel).send("<:DiscordTelPhone:310817969498226718> "+item.url);
					});
				}
			}
			calls.splice(calls.indexOf(call), 1);
			call.time = Date.now();
			calls.push(call);
			fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
			setTimeout(function(){
				call = calls.find(function(item) {
					if (	item.from.channel === message.channel.id) {
						return item.from.channel === message.channel.id;
					}
					else if (item.to.channel === message.channel.id) {
						return item.to.channel === message.channel.id;
					}
					else {return undefined;}
				});
				if (call !== undefined) {
					if (call.time <= Date.now() - 120000) {
						bot.channels.get("282253502779228160").send(":telephone: The call between channel "+call.from.channel+" and channel "+call.to.channel+" is expired.");
						bot.channels.get(call.from.channel).send(":negative_squared_cross_mark: This call has expired (2 minutes).");
						bot.channels.get(call.to.channel).send(":x: This call has expired (2 minutes).");
						calls.splice(calls.indexOf(call), 1);
						fs.writeFileSync("./call.json", JSON.stringify(calls), "utf8");
						if(!mailbox_storage.find(a=>a.channel===call.to.channel)){
							bot.channels.get(call.from.channel).send(":x: Call ended; their mailbox isn't setup");
							return;
						}
						bot.channels.get(call.from.channel).send(":x: "+mailbox_storage.find(a=>a.channel===call.to.channel).settings.autoreply);
						bot.channels.get(call.from.channel).send(":question: Would you like to leave a message? `>message [number] [message]`");
						recentCall[call.from.channel]=call.to.number;
					}
				}
			},120000);
		}
	}
});
bot.on("messageReactionAdd", (reaction, user) => {
	var theorder = orders.find(function(item){return item.message === reaction.message.id});
	if (reaction.message.channel.id === "310144658552651777" && reaction.emoji.name === "\u2705" && chef(user.id) && theorder !== undefined && theorder.status === 2) {
		reaction.message.delete();
		var account = accounts.find(function(item) {
			return item.user === user.id;
		});
		if (account === undefined) {
			account = {user:user.id,balance:theorder.order.split(" ").length * 3};
			accounts.push(account);
			bot.users.get(user.id).send("You don't have an account created...Creating an account for you! Please also read for information on payment: <http://discordtel.readthedocs.io/en/latest/Payment/>\n(Don't worry, salary is added to your new account)");
			fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
		}
		else {
			accounts.splice(accounts.indexOf(account), 1);
			account.balance += theorder.order.split(" ").length * 3;
			accounts.push(account);
			fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
		}
		bot.channels.get("282253502779228160").send(":moneybag: Restaurant worker "+user.username+" earned ¥"+theorder.order.split(" ").length * 3+" for cooking.");
		user.send("Order accepted. You earned __"+theorder.order.split(" ").length * 3+" credits__ for cooking.");
		setTimeout(function(){
			bot.channels.get(theorder.channel).createInvite({
				maxAge: 0, // 0 = Infinity
				maxUses: 0 // ^^^^^^^^^^^^
			}).then(invite => {
				user.send("Time to deliver! The invite is "+invite.url+" . They ordered `"+theorder.ordertext+"` with note `"+theorder.note+"`.");
			});
			orders.splice(orders.indexOf(theorder), 1);
			fs.writeFileSync("./orders.json", JSON.stringify(orders), "utf8");
		}, theorder.order.split(" ").length * 120000);
	}
	else if (reaction.message.channel.id === "310144658552651777" && reaction.emoji.name === "\u274c" && chef(user.id) && theorder !== undefined && theorder.status === 2) {
		user.send("Order rejected.");
		bot.users.get(theorder.user).send("Your order is rejected by our restaurant worker `"+user.username+"#"+user.discriminator+"`.");
		reaction.message.delete();
		orders.splice(orders.indexOf(theorder), 1);
		fs.writeFileSync("./orders.json", JSON.stringify(orders), "utf8");
	}
});
bot.on("guildCreate", guild => {
	if (guild.defaultChannel === undefined) {
		guild.owner.send("(Discord removed default channel. So no matter who added DiscordTel, I'm sending this to the owner of server `"+guild.name+"`, which is you!)\n\nHello guys, It's **DiscordTel**, the telephone/order solution for Discord! To learn more, type `>info`. To get command help, type `>help`. To get a number, read <http://discordtel.rtfd.io/> and then type `>wizard` in the channel you wish to enable the service.\n**Warning:** No troll calls. You are required to read the documentation. To keep your number available you need to renew your number which is instructed at <http://discordtel.readthedocs.io/en/latest/Payment/>.\n*ToS Compliance: <http://discordtel.readthedocs.io/en/latest/ToS%20Compliance/>*");
	} else {
		guild.defaultChannel.send("Hello guys, It's **DiscordTel**, the telephone/order solution for Discord! To learn more, type `>info`. To get command help, type `>help`. To get a number, read <http://discordtel.rtfd.io/> and then type `>wizard` in the channel you wish to enable the service.\n**Warning:** No troll calls. You are required to read the documentation. To keep your number available you need to renew your number which is instructed at <http://discordtel.readthedocs.io/en/latest/Payment/>.\n*ToS Compliance: <http://discordtel.readthedocs.io/en/latest/ToS%20Compliance/>*");
	}
	bot.channels.get("282253502779228160").send(":inbox_tray: Joined "+guild.name+" ("+guild.id+"). Currently in "+bot.guilds.array().length+" servers.");
});
bot.on("guildDelete", guild => {
	bot.channels.get("282253502779228160").send(":outbox_tray: Left "+guild.name+" ("+guild.id+"). Currently in "+bot.guilds.array().length+" servers.");
});
bot.on("presenceUpdate", (oldMember, newMember) => {
	if (oldMember.id === "209891913548038144" && newMember.id === "209891913548038144") {
		if (oldMember.presence.status === "offline" || newMember.presence.status === "online") {
			bot.channels.get("272137985871577088").send("The Minecraft server has came online!");
		}
		else if (oldMember.presence.status === "online" || newMember.presence.status === "offline") {
			bot.channels.get("272137985871577088").send("The Minecraft server is down! <@155784937511976960> <@171319044715053057>");
		}
	}
});
var jackpot = schedule.scheduleJob({hour: 0, minute: 0, second: 0}, function() {
	dailies = [];
	fs.writeFileSync("./daily.json", JSON.stringify(dailies), "utf8");
	if (award.amount !== 0 && award.users !== []) {
		var winner = award.users[Math.floor(Math.random()*award.users.length)];
		var leaccount = accounts.find(function(item) {
			return item.user === winner;
		});
		if (leaccount === undefined) {
			leaccount = {user:winner,balance:award.amount};
			accounts.push(leaccount);
			bot.users.get(winner).send("You don't have an account created...Creating an account for you! Please also read for information on payment: <http://discordtel.readthedocs.io/en/latest/Payment/>");
		}
		else {
			accounts.splice(accounts.indexOf(leaccount), 1);
			leaccount.balance += award.amount;
			accounts.push(leaccount);
		}
		fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
		bot.users.get(winner).send("**YOU WON THE LOTTERY!**\n¥"+award.amount);
		bot.channels.get("282253502779228160").send(":tada: User __"+bot.users.get(winner).username+"#"+bot.users.get(winner).discriminator+"__ ("+winner+") won the lottery which valued at "+award.amount+"");
		award = {users:[], amount:0};
		fs.writeFileSync("./award.json", JSON.stringify(award), "utf8");
	}
});
var wage = schedule.scheduleJob({date: 1, hour: 0, minute: 0, second: 0}, function(){
	bot.guilds.get('281815661317980160').roles.get('281815839936741377').members.forEach(u => {
		var account = accounts.find(function(item) {
			return item.user === u.id;
		});
		if (bot.guilds.get('281815661317980160').roles.get('284443515516354560').members.map(member => member.id).indexOf(u.id) > -1) {
			accounts.splice(accounts.indexOf(account), 1);
			account.balance += 4000;
			accounts.push(account);
			fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
			bot.users.get(u.id).send("Here, have your $4000 wage! Your current balance is $"+account.balance+".");
		}
		else {
			accounts.splice(accounts.indexOf(account), 1);
			account.balance += 2000;
			accounts.push(account);
			fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
			bot.users.get(u.id).send("Here, have your $2000 wage! Your current balance is $"+account.balance+".");
		}
	});
	numbers.forEach(n => {
		if (n.year === new Date().getFullYear() && n.month === new Date().getMonth()) {
			bot.channels.get(n.channel).send("Your number is expired! Pay your monthly fee by typing `>dial *233`!");
		}
	});
});
setInterval(function(){
	request({url:"http://discoin.sidetrip.xyz/transactions", headers: {'Authorization': discoin_token}}, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			body = JSON.parse(body);
			body.forEach(t => {
				var leaccount = accounts.find(function(item) {
					return item.user === t.user;
				});
				if (leaccount === undefined) {
					leaccount = {user:t.user,balance:t.amount};
					accounts.push(leaccount);
					bot.users.get(t.user).send("You don't have an account created...Creating an account for you! Please also read for information on payment: <http://discordtel.readthedocs.io/en/latest/Payment/>");
				}
				else {
					accounts.splice(accounts.indexOf(leaccount), 1);
					leaccount.balance += t.amount;
					accounts.push(leaccount);
				}
				fs.writeFileSync("./account.json", JSON.stringify(accounts), "utf8");
				bot.users.get(t.user).send("You've received ¥"+t.amount+" from Discoin (Transaction ID: "+t.receipt+").\n*You can check all your transactions at <http://discoin.sidetrip.xyz/record>.*");
				bot.channels.get("282253502779228160").send(":repeat: User __"+bot.users.get(t.user).username+"#"+bot.users.get(t.user).discriminator+"__ ("+t.user+") received ¥"+t.amount+" from Discoin.");
			});
		}
	});
}, 60000);
bot.login("Censored");
