# 심볼 팝 (Symbol Pop)

닮은꼴 심볼을 드래그로 이어서 터뜨리는 캐주얼 매치 게임 프로토타입.

## 폴더 구조
```
symbol-pop/
├── index.html      # 마크업
├── style.css       # 스타일 (배경 이미지 교체 지점: 상단 body{} 주석 참고)
├── game.js         # 게임 로직 (스테이지, 드래그 매칭, 파워업 등)
├── assets/
│   ├── images/     # 배경, 마스코트, 아이콘, 심볼 아트 등 이미지 에셋
│   └── sounds/     # 효과음/BGM (추후)
└── README.md
```

## 이미지 교체 방법
- 배경: `assets/images/bg.png`를 넣고 `style.css` 상단 body{} 주석 참고해 한 줄만 교체
- 아이콘/캐릭터: 파일 추가 후 `index.html`의 해당 이모지(🐥🍭💣🔄🌈 등)를 `<img src="assets/images/xxx.png">`로 교체

## 배포
Vercel에 이 폴더(symbol-pop/) 자체를 정적 사이트로 연결하면 됩니다.
