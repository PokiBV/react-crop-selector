import React from 'react';
import styles from './crop-selector.css';

export default class CropSelector extends React.Component {
	static propTypes = {
		width: React.PropTypes.number.isRequired,
		height: React.PropTypes.number.isRequired,
		onChange: React.PropTypes.func,
		x1: React.PropTypes.number,
		y1: React.PropTypes.number,
		x2: React.PropTypes.number,
		y2: React.PropTypes.number,
		minWidth: React.PropTypes.number,
		minHeight: React.PropTypes.number,
		ratio: React.PropTypes.string,
		guide: React.PropTypes.oneOf(['rule-of-thirds']),
	};

	static defaultProps = {
		x1: 0,
		y1: 0,
		x2: 100,
		y2: 100,
		minWidth: 0,
		minHeight: 0,
	};

	constructor({ width, height, x1, y1, x2, y2 }) {
		super();

		this.state = {
			dragging: false,
			x1: Math.round((width / 100) * x1),
			y1: Math.round((height / 100) * y1),
			x2: Math.round((width / 100) * x2),
			y2: Math.round((height / 100) * y2),
		};

		this.onDragStart = this.onDragStart.bind(this);
		this.onDragMove = this.onDragMove.bind(this);
		this.onDragEnd = this.onDragEnd.bind(this);
	}

	componentWillMount() {
		const { x1, y1, x2, y2 } = this.state;
		const { width: maxX, height: maxY } = this.props;

		this.handle = 'N';
		const coords = this.adjustPosition(x1, y1, x2, y2);
		this.handle = '';

		const width = coords.x2 - coords.x1;
		const height = coords.y2 - coords.y1;

		coords.x1 = Math.round((maxX - width) / 2);
		coords.x2 = coords.x1 + width;
		coords.y1 = Math.round((maxY - height) / 2);
		coords.y2 = coords.y1 + height;

		this.setState(coords);
	}

	componentWillReceiveProps({ width, height, x1, y1, x2, y2 }) {
		this.setState({
			x1: Math.round((width / 100) * x1),
			y1: Math.round((height / 100) * y1),
			x2: Math.round((width / 100) * x2),
			y2: Math.round((height / 100) * y2),
		});
	}

	onDragStart(ev) {
		ev.preventDefault();

		const { x1, y1, x2, y2 } = this.state;
		this.startCoords = { x1, y1, x2, y2 };
		this.startPos = { x: ev.pageX, y: ev.pageY };

		this.handle = ev.target.dataset.handle || '';
		this.lock = {
			x1: this.handle ? !/W/.test(this.handle) : false,
			y1: this.handle ? !/N/.test(this.handle) : false,
			x2: this.handle ? !/E/.test(this.handle) : false,
			y2: this.handle ? !/S/.test(this.handle) : false,
		};

		this.setState({ dragging: true });

		window.addEventListener('mousemove', this.onDragMove);
		window.addEventListener('mouseup', this.onDragEnd);
	}

	onDragMove(ev) {
		const pos = { x: ev.pageX, y: ev.pageY };
		const dX = pos.x - this.startPos.x;
		const dY = pos.y - this.startPos.y;

		const { x1, y1, x2, y2 } = this.startCoords;
		this.setPosition(
			this.lock.x1 ? x1 : x1 + dX,
			this.lock.y1 ? y1 : y1 + dY,
			this.lock.x2 ? x2 : x2 + dX,
			this.lock.y2 ? y2 : y2 + dY,
		);
	}

	onDragEnd() {
		this.handle = '';
		this.setState({ dragging: false });

		window.removeEventListener('mousemove', this.onDragMove);
		window.removeEventListener('mouseup', this.onDragEnd);
	}

	setPosition(x1, y1, x2, y2) {
		const { width, height } = this.props;
		const coords = this.adjustPosition(x1, y1, x2, y2);

		this.setState(coords);

		if (this.props.onChange) {
			this.props.onChange(
				Math.round((100 / width) * coords.x1),
				Math.round((100 / height) * coords.y1),
				Math.round((100 / width) * coords.x2),
				Math.round((100 / height) * coords.y2)
			);
		}
	}

	adjustPosition(x1, y1, x2, y2) {
		const { width: maxX, height: maxY } = this.props;
		const minWidth = (maxX / 100) * this.props.minWidth;
		const minHeight = (maxY / 100) * this.props.minHeight;
		let width = x2 - x1;
		let height = y2 - y1;

		if (x1 < 0) {
			x1 = 0;
			x2 = this.lock.x2 ? x2 : x1 + width;
		}

		if (x2 > maxX) {
			x2 = maxX;
			x1 = this.lock.x1 ? x1 : x2 - width;
		}

		if (y1 < 0) {
			y1 = 0;
			y2 = this.lock.y2 ? y2 : y1 + height;
		}

		if (y2 > maxY) {
			y2 = maxY;
			y1 = this.lock.y1 ? y1 : y2 - height;
		}

		width = x2 - x1;
		height = y2 - y1;

		if (width < minWidth && this.handle) {
			width = minWidth;

			if (/E/.test(this.handle)) {
				x2 = x1 + width;
			} else if (/W/.test(this.handle)) {
				x1 = x2 - width;
			}
		}

		if (height < minHeight && this.handle) {
			height = minHeight;

			if (/N/.test(this.handle)) {
				y1 = y2 - height;
			} else if (/S/.test(this.handle)) {
				y2 = y1 + height;
			}
		}

		if (this.props.ratio && this.handle) {
			const ratio = this.props.ratio.split(':').map(i => parseInt(i, 10));

			if (/(?:N|S)/.test(this.handle)) {
				width = Math.round((height / ratio[1]) * ratio[0]);

				if (width < minWidth) {
					width = minWidth;
					height = Math.round((width / ratio[0]) * ratio[1]);

					if (/S/.test(this.handle)) {
						y2 = y1 + height;
					} else {
						y1 = y2 - height;
					}
				}

				if (/W/.test(this.handle)) {
					x1 = x2 - width;
				} else {
					x2 = x1 + width;
				}

				if (x1 < 0 || x2 > maxX) {
					if (x1 < 0) {
						x1 = 0;
					}

					if (x2 > maxX) {
						x2 = maxX;
					}

					width = x2 - x1;
					height = Math.round((width / ratio[0]) * ratio[1]);

					if (/S/.test(this.handle)) {
						y2 = y1 + height;
					} else {
						y1 = y2 - height;
					}
				}
			}

			if (/(?:E|W)/.test(this.handle)) {
				height = Math.round((width / ratio[0]) * ratio[1]);

				if (height < minHeight) {
					height = minHeight;
					width = Math.round((height / ratio[1]) * ratio[0]);

					if (/E/.test(this.handle)) {
						x2 = x1 + width;
					} else {
						x1 = x2 - width;
					}
				}

				if (/N/.test(this.handle)) {
					y1 = y2 - height;
				} else {
					y2 = y1 + height;
				}

				if (y1 < 0 || y2 > maxY) {
					if (y1 < 0) {
						y1 = 0;
					}

					if (y2 > maxY) {
						y2 = maxY;
					}

					height = y2 - y1;
					width = Math.round((height / ratio[1]) * ratio[0]);

					if (/E/.test(this.handle)) {
						x2 = x1 + width;
					} else {
						x1 = x2 - width;
					}
				}
			}
		}

		return { x1, y1, x2, y2 };
	}

	render() {
		const { width, height, guide, ratio } = this.props;
		const { dragging, x1, y1, x2, y2 } = this.state;

		const cropStyle = {
			width: x2 - x1,
			height: y2 - y1,
			transform: `translate(${x1}px, ${y1}px)`,
		};

		const overlays = [
			{ width: x2 - x1, height: y1, transform: `translateX(${x1}px)` },
			{ width: width - x2, height, transform: `translateX(${x2}px)` },
			{ width: x2 - x1, height: height - y2, transform: `translate(${x1}px, ${y2}px)` },
			{ width: x1, height },
		];

		const handles = ratio ? [] : ['N', 'E', 'S', 'W'];
		handles.push('NE', 'SE', 'SW', 'NW');

		const classes = [styles.container];
		if (dragging) {
			classes.push(styles.dragging);
		}

		return (
			<div
				className={classes.join(' ')}
				style={{ width, height }}
				ref={el => { this.containerEl = el; }}
			>
				{overlays.map((style, index) => (
					<div key={index} className={styles.overlay} style={style} />
				))}
				<div
					className={styles.crop}
					style={cropStyle}
					onMouseDown={this.onDragStart}
				>
					{handles.map(handle => (
						<div
							key={handle}
							className={styles.handle}
							data-handle={handle}
						/>
					))}
					{guide === 'rule-of-thirds' && (
						<div className={`${styles.guides} ${styles.ruleOfThirds}`}>
							<div className={styles.guideHorz1} />
							<div className={styles.guideHorz2} />
							<div className={styles.guideVert1} />
							<div className={styles.guideVert2} />
						</div>
					)}
				</div>
			</div>
		);
	}
}
