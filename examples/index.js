import InfiniteTree from '../src';
import rowRenderer from './renderer';
import '../src/index.styl';
import { addEventListener, preventDefault, stopPropagation, quoteattr } from '../src/helper';

const data = [];
const source = '{"id":"<root>","label":"<root>","props":{"droppable":true},"children":[{"id":"alpha","label":"Alpha","props":{"droppable":true}},{"id":"bravo","label":"Bravo","props":{"droppable":true},"children":[{"id":"charlie","label":"Charlie","props":{"droppable":true},"children":[{"id":"delta","label":"Delta","props":{"droppable":true},"children":[{"id":"echo","label":"Echo","props":{"droppable":true}},{"id":"foxtrot","label":"Foxtrot","props":{"droppable":true}}]},{"id":"golf","label":"Golf","props":{"droppable":true}}]},{"id":"hotel","label":"Hotel","props":{"droppable":true},"children":[{"id":"india","label":"India","props":{"droppable":true},"children":[{"id":"juliet","label":"Juliet","props":{"droppable":true}}]}]},{"id":"kilo","label":"Kilo","props":{"droppable":true}}]}]}';

for (let i = 0; i < 1000; ++i) {
    data.push(JSON.parse(source.replace(/"(id|label)":"([^"]*)"/g, '"$1": "$2.' + i + '"')));
}

const tree = new InfiniteTree({
    autoOpen: true, // Defaults to false
    droppable: true, // Defaults to false
    el: document.querySelector('#tree'),
    rowRenderer: rowRenderer,
    selectable: true // Defaults to true
});

const updatePreview = (node) => {
    const el = document.querySelector('#preview');
    if (node) {
        el.innerHTML = JSON.stringify({
            id: node.id,
            label: node.label,
            children: node.children ? node.children.length : 0,
            parent: node.parent ? node.parent.id : null,
            state: node.state
        }, null, 2).replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');
    } else {
        el.innerHTML = '';
    }
};

tree.on('scrollProgress', (progress) => {
    document.querySelector('#scrolling-progress').style.width = progress + '%';
});
tree.on('update', () => {
    const node = tree.getSelectedNode();
    updatePreview(node);
});
tree.on('openNode', (node) => {
    console.log('openNode', node);
});
tree.on('closeNode', (node) => {
    console.log('closeNode', node);
});
tree.on('dropNode', (node, e) => {
    const source = e.dataTransfer.getData('text');
    console.log('Dragged an element ' + JSON.stringify(source) + ' and dropped to ' + JSON.stringify(node.label));
    document.querySelector('#dropped-result').innerHTML = 'Dropped to <b>' + quoteattr(node.label) + '</b>';
});
tree.on('selectNode', (node) => {
    updatePreview(node);
});

tree.loadData(data);

// Draggable Element
const draggableElement = document.querySelector('#draggable-element');

// http://stackoverflow.com/questions/5500615/internet-explorer-9-drag-and-drop-dnd
addEventListener(draggableElement, 'selectstart', (e) => {
    preventDefault(e);
    stopPropagation(e);
    draggableElement.dragDrop();
    return false;
});

addEventListener(draggableElement, 'dragstart', (e) => {
    e.dataTransfer.effectAllowed = 'move';
    const target = e.target || e.srcElement;
    e.dataTransfer.setData('text', target.id);
    document.querySelector('#dropped-result').innerHTML = '';
});

addEventListener(draggableElement, 'dragend', function(e) {
});

window.tree = tree;
