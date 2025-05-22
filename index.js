const sound = require('sound-play');
const path = require('path');
const fs = require('fs');

const { GlobalKeyboardListener } = require("node-global-key-listener")
const v = new GlobalKeyboardListener();

async function reproduzirSons() {
  try {
    // Reproduzir um arquivo .wav
    const caminhoWav = path.join(__dirname, 'audios', 'som.mp3');
    console.log(`Reproduzindo: ${caminhoWav}`);
    await sound.play(caminhoWav);
    console.log('Arquivo WAV reproduzido com sucesso!');

    // Esperar um pouco antes de reproduzir o próximo som (opcional)
    //await new Promise(resolve => setTimeout(resolve, 1000));

    // Reproduzir um arquivo .mp3
    // const caminhoMp3 = path.join(__dirname, 'audios', 'pei2.mp3');
    // console.log(`Reproduzindo: ${caminhoMp3}`);
    // await sound.play(caminhoMp3);
    // console.log('Arquivo MP3 reproduzido com sucesso!');

  } catch (err) {
    console.error('Erro ao reproduzir o som:', err);
  }
}

const datafile = path.join(__dirname, 'data', 'data.json');
let data = {};

let startTime = new Date();
let fileName = new Date().toLocaleString().replace(',', '').replaceAll('/', '-').replaceAll('\\', '-').replaceAll(':', '-') +'.txt';

function getPlugin(plugin) {

  if (!fs.existsSync(datafile))
    fs.writeFileSync(datafile, JSON.stringify({
      key: 'DOT',
      'RIGHT_SHIFT': false,
      'RIGHT_CTRL': true,
      'LEFT_SHIFT': false,
      'LEFT_CTRL': false,
    }));

  data = JSON.parse(fs.readFileSync(datafile));

  v.addListener(function (e, down) {
    if (e.state == "UP") {
      shiftIsPressed = down["LEFT SHIFT"] || down["RIGHT SHIFT"];
      ctrlIsPressed = down["LEFT CTRL"] || down["RIGHT CTRL"];
      plugin.log({ event: e, down: down });

      if (data['RIGHT_SHIFT'] && !down["RIGHT SHIFT"]) return;
      if (data['RIGHT_CTRL'] && !down["RIGHT CTRL"]) return;
      if (data['LEFT_SHIFT'] && !down["LEFT SHIFT"]) return;
      if (data['LEFT_CTRL'] && !down["LEFT CTRL"]) return;

      if (e.name != data.key) return;
      plugin.log('HOTKEY PRESSED');
      let milisseconds = new Date() - startTime;
      let seconds = milisseconds / 1000;
      milisseconds = Math.floor(milisseconds % 1000);
      let minutes = Math.floor(seconds / 60);
      seconds = Math.floor(seconds % 60);
      let hours = Math.floor(minutes / 60);
      minutes = Math.floor(minutes % 60);
      const filePath = path.join(__dirname, 'data', fileName);
      fs.appendFile(filePath, `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}\r\n`, (err) => {
        if(err) {
          // punir o usuario
          plugin.log(err);
          reproduzirSons();
        }
      });
    }
  });

  plugin.init = (trayMenu, mainMenu) => {
    plugin.log('LivePontos init');
  };

  plugin.beforePageLoad = () => {
  };

  plugin.onPageLoad = (page) => {
    page.addEventListener('click', '#btn-novo', () => {
      fileName = new Date().toLocaleString().replace(',', '').replaceAll('/', '-').replaceAll('\\', '-') +'.txt';
      startTime = new Date();
    });
  };

  plugin.beforePageClose = (page) => {
  };

  plugin.onPageClose = () => {
  };

  plugin.beforeQuit = () => {
    plugin.log('LivePontos beforeQuit');
  };

}

module.exports = {
  getPlugin,
};
