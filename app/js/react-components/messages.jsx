var Message = React.createClass({
	dropMessage: function() {
		this.setState({
			// hidden: 
		})
	},

	componentDidMount: function() {
		if(this.props.callback) this.props.callback.apply(this);
	},

	render: function() {
		var messageContent;
		if(this.props.contentType === 'text')
			messageContent = this.props.message;
		else if(this.props.contentType === 'audio')
			messageContent = (
				<audio controls>
					<source src={this.props.message} type="audio/mp3" />
				</audio>
			);
		else if(this.props.contentType === 'image')
			messageContent = (
				<img src={this.props.message} />
			);
		else if(this.props.contentType === 'video')
			messageContent = (
				<video controls>
					<source src={this.props.message} type="video/mp4" />
				</video>
			);
		else messageContent = this.props.message;

		return (
			<div className={'message '+(this.props.self ? 'self' : 'default')}>
				{!this.props.self ? (<div className="avatar">
					<img src={this.props.avatar} />
					<i>{this.props.sender}</i>
				</div>) : <b></b> }

				<span className="bubble">{messageContent}</span>

				{this.props.self ? (<div className="avatar">
					<img src={this.props.avatar} />
					<i>{this.props.sender}</i>
				</div>) : <b></b>}

			</div>
		);
	}
});


var Messenger = React.createClass({
	mixins: [React.addons.LinkedStateMixin],

	clear: function() {
		this.setState({
			messages: []
		});
	},

	componentDidMount: function() {
	},

	setBackgroundColor: function(backgroundColor) {
		this.setState({
			backgroundColor: backgroundColor
		});
	},

	setBackgroundImage: function(backgroundImage) {
		this.setState({
			backgroundImage: backgroundImage
		});
	},

	// componentWillUpdate: function() {
	//   var messagePane = this.getDOMNode().querySelector('#messagePane');
	//   this.shouldScrollBottom = messagePane.scrollTop + messagePane.offsetHeight === messagePane.scrollHeight;
	// },
	 
	componentDidUpdate: function() {
	  // if (this.shouldScrollBottom) {
	    var messagePane = this.getDOMNode().querySelector('#messagePane');
	    messagePane.scrollTop = messagePane.scrollHeight
	  // }
	},

	getInitialState: function() {
		return {
			backgroundImage: '',
			backgroundColor: 'transparent',
			messages: [
				// {message: 'Yo listen to this', contentType: 'text'},
				// {message: 'https://raw.githubusercontent.com/tholman/elevator.js/master/demo/music/elevator.mp3', contentType: 'audio'},
				// {message: 'https://38.media.tumblr.com/d9ca90da02e892260ec499687d425047/tumblr_mrny78nKb31ry07c8o1_400.gif', contentType: 'image'},
				// {message: '', contentType: 'video'}
			],
			answers: [],
			inputBuffer: '',
			disableInput: false,
		}
	},

	render: function() {
		var containerStyle = {
			backgroundImage: this.state.backgroundImage,
			backgroundColor: this.state.backgroundColor
		}

		var host = this;

		return (
			<div style={containerStyle} className="messenger">
				<div id="headerPane"></div>
				<div style={this.state.messagesPaneStyle} id="messagePane">
					{this.state.messages.map(function(message) {
						return (
							// <Avatar url={message.user.avatarURL}></Avatar>
							<Message sender={message.sender} avatar={message.avatar} host={host} message={message.message} contentType={message.contentType} self={message.self} callback={message.callback}></Message>
						);
					})}
					<div id="indicator" className="message indicator" hidden={this.state.inputBuffer === ''}>
						<span className="bubble">
						<i className="point"></i>
						<i className="point"></i>
						<i className="point"></i>
						</span>
					</div>
				</div>
				<div style={this.state.inputPaneStyle} id="inputPane">
					<form onSubmit={this.handleSubmit}>
						<input id="textInput" type="text" placeholder="Type your message..." valueLink={this.linkState('inputBuffer')} disabled={this.state.disableInput}></input>
						<input type="submit" value="Send" disabled={this.state.disableInput}></input>
					</form>
				</div>
			</div>
		);
	},

	handleSubmit: function(e) {
		e.preventDefault();
		if(this.state.inputBuffer) {
			this.post({
				message: this.state.inputBuffer,
				contentType: 'text',
				self: true,
				avatar: '../../img/narrator_icon_chat.png',
				sender: 'You',
			}, this.state.answerCallback, true);

			if(this.questionBuffer) {
				this.setState({
					answers: this.state.answers.concat([{
						question: this.questionBuffer,
						answer: this.state.inputBuffer
					}])
				});
			}

			this.setState({inputBuffer: ''});
			this.questionBuffer = '';
			this.hideInput();
		}
	},

	handleInputChange: function(e) {
		this.setState({inputBuffer: e.target.value});
	},

	post: function(message, callback, contentType, self, avatar, sender, suppressSound) {
		var newPost;
		if(typeof message === 'object') {
			newPost = message;
			suppressSound = contentType;
			message.callback = callback;
		}
		else {
			newPost = {
				message: message,
				contentType: contentType,
				self: self,
				avatar: avatar,
				sender: sender,
				callback: callback
			}
		}
		var notifSound = new Audio('../../audio/TextSFX_3.mp3');

		this.setState({
			messages: this.state.messages.concat([newPost])
		});

		if(!suppressSound) notifSound.play();
	},

	prompt: function(question,callback) {
		this.post({
			message: question,
			contentType: 'text',
			avatar: '../../img/narrator_icon_chat.png',
			sender: 'Narrator',
			self: false
		});
		this.showInput();
		this.questionBuffer = question;
		this.setState({
			answerCallback: callback
		});
	},

	toggleInput: function() {
		this.setState({
			disableInput: !this.state.disableInput
		});
	},

	showInput: function() {
		this.setState({
			messagesPaneStyle: {
				marginBottom: '-52px',
				paddingBottom: '64px'
			},
			inputPaneStyle: {
				display: 'block'
			}
		})
	},

	hideInput: function() {
		this.setState({
			messagesPaneStyle: {
				marginBottom: '0',
				paddinBottom: '0'
			},
			inputPaneStyle: {
				display: 'none'
			}
		})
	}

});
