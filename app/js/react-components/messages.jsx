var Message = React.createClass({
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
				<span className="bubble">{messageContent}</span>
			</div>
		);
	}
});


var Messenger = React.createClass({
	mixins: [React.addons.LinkedStateMixin],

	componentDidMount: function() {
	},

	setBackground: function(background) {
		this.setState({
			background: background
		});
	},

	componentWillUpdate: function() {
	  var messagePane = this.getDOMNode().querySelector('#messagePane');
	  this.shouldScrollBottom = messagePane.scrollTop + messagePane.offsetHeight === messagePane.scrollHeight;
	},
	 
	componentDidUpdate: function() {
	  if (this.shouldScrollBottom) {
	    var messagePane = this.getDOMNode().querySelector('#messagePane');
	    messagePane.scrollTop = messagePane.scrollHeight
	  }
	},

	getInitialState: function() {
		return {
			background: '',			
			messages: [
				// {message: 'Yo listen to this', contentType: 'text'},
				// {message: 'https://raw.githubusercontent.com/tholman/elevator.js/master/demo/music/elevator.mp3', contentType: 'audio'},
				// {message: 'https://38.media.tumblr.com/d9ca90da02e892260ec499687d425047/tumblr_mrny78nKb31ry07c8o1_400.gif', contentType: 'image'},
				// {message: '', contentType: 'video'}
			],
			answers: [],
			inputBuffer: ''
		}
	},

	render: function() {
		var containerStyle = {
			background: this.state.background
		}
		return (
			<div style={containerStyle} className="messenger">
				<div id="headerPane"></div>
				<div id="messagePane">
					{this.state.messages.map(function(message) {
						return (
							// <Avatar url={message.user.avatarURL}></Avatar>
							<Message message={message.message} contentType={message.contentType} self={message.self}></Message>
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
				<div id="inputPane">
					<form onSubmit={this.handleSubmit}>
						<input id="textInput" type="text" placeholder="Type your message..." valueLink={this.linkState('inputBuffer')}></input>
						<input type="submit" value="Send"></input>
					</form>
				</div>
			</div>
		);
	},

	handleSubmit: function(e) {
		e.preventDefault();
		if(this.state.inputBuffer) {
			this.post(this.state.inputBuffer, 'text', true);

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
		}
	},

	handleInputChange: function(e) {
		this.setState({inputBuffer: e.target.value});
	},

	post: function(message, contentType, self, suppressSound, callback) {
		var newPost;
		if(typeof message === 'object') {
			newPost = message;
			suppressSound = contentType;
			callback = self;
		}
		else {
			newPost = {
				message: message,
				contentType: contentType,
				self: self
			}
		}
		var notifSound = new Audio('/audio/TextSFX_3.mp3');

		if(callback) callback.apply(this, []);

		this.setState({
			messages: this.state.messages.concat([newPost])
		});

		if(!suppressSound) notifSound.play();
	},

	prompt: function(question) {
		this.post({
			message: question,
			contentType: 'text'
		});
		this.questionBuffer = question;
	},

});
