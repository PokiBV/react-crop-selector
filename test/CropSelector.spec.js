/* eslint-disable import/no-extraneous-dependencies,react/jsx-filename-extension */
import test from 'ava';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { spy } from 'sinon';
import CropSelector from '..';
import styles from '../lib/crop-selector.css';

Enzyme.configure({ adapter: new Adapter() });

test('<CropSelector /> should set given width and height on container', t => {
	const container = shallow(<CropSelector width={640} height={480} />);
	t.deepEqual(container.prop('style'), { width: 640, height: 480 });
});

test('<CropSelector /> should set default state', t => {
	const container = shallow(<CropSelector width={640} height={480} />);
	t.deepEqual(container.state(), { dragging: false, x1: 0, y1: 0, x2: 640, y2: 480 });
});

test('<CropSelector /> should calculate crop coordinates', t => {
	const container = shallow(
		<CropSelector
			width={640}
			height={480}
			x1={5}
			y1={5}
			x2={95}
			y2={95}
		/>
	);

	t.deepEqual(container.state(), {
		dragging: false,
		x1: Math.round((640 / 100) * 5),
		y1: Math.round((480 / 100) * 5),
		x2: Math.round((640 / 100) * 95),
		y2: Math.round((480 / 100) * 95),
	});
});

test('<CropSelector /> should render the crop area', t => {
	const container = shallow(<CropSelector width={640} height={480} />);
	t.is(container.find(`.${styles.crop}`).length, 1);
});

test('<CropSelector /> should position the crop area', t => {
	const container = shallow(
		<CropSelector
			width={640}
			height={480}
			x1={5}
			y1={5}
			x2={95}
			y2={95}
		/>
	);

	const x1 = Math.round((640 / 100) * 5);
	const y1 = Math.round((480 / 100) * 5);
	const x2 = Math.round((640 / 100) * 95);
	const y2 = Math.round((480 / 100) * 95);

	t.deepEqual(container.find(`.${styles.crop}`).prop('style'), {
		width: x2 - x1,
		height: y2 - y1,
		transform: `translate(${x1}px, ${y1}px)`,
	});
});

test('<CropSelector /> should render all handles', t => {
	const container = shallow(<CropSelector width={640} height={480} />);
	t.is(container.find(`.${styles.crop} .${styles.handle}`).length, 8);
});

test('<CropSelector /> should add handle data attribute for each handle', t => {
	const container = shallow(<CropSelector width={640} height={480} />);
	const rendered = container
		.find(`.${styles.crop} .${styles.handle}`)
		.map(handle => handle.prop('data-handle'));

	t.deepEqual(rendered, ['N', 'E', 'S', 'W', 'NE', 'SE', 'SW', 'NW']);
});

test('<CropSelector /> should update state on position update', t => {
	const container = shallow(<CropSelector width={640} height={480} />);
	container.instance().setPosition(10, 10, 630, 470);
	t.deepEqual(container.state(), { dragging: false, x1: 10, y1: 10, x2: 630, y2: 470 });
});

test('<CropSelector /> should call onChange when position updates', t => {
	const onChange = spy();
	const container = shallow(<CropSelector width={640} height={480} onChange={onChange} />);
	container.instance().setPosition(10, 10, 630, 470);
	t.truthy(onChange.calledOnce);
});
