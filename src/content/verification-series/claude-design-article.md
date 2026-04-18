---
title: "Claude Designを一日触ってわかったこと——「指示の外側まで考える」ツールの正体"
seriesLabel: "— ツール検証レポート"
date: "2026.04.18"
description: "2026年4月research preview公開のClaude Designを検証。「指示していないのに動く」その構造と、デザイナー視点でわかった使い方の実態。"
---

---

> ※本記事は2026年4月時点の情報をもとに執筆しています。research previewのため、機能・料金・仕様は今後変更される可能性があります。

---

## はじめに

2026年4月、AnthropicがClaude Designをresearch previewとして公開しました。「会話でデザインを作る」というコンセプト自体は目新しくないですが、実際に触ってみると、これまでのAIデザインツールとは明らかに何かが違う。

そう感じた理由を言語化したくて、この記事を書きました。

**なお、Claude DesignはPro以上のプランが必要です（2026年4月時点）。Freeプランでは利用できません。** 料金が気になる方は先に公式の料金ページをご確認ください。

難しいことはやっていません。プロンプトを入力して、画像を渡して、コメントを書いて、エクスポートする。それだけです。それだけのはずでした。

ツールの操作を覚える必要もなく、デザインの専門知識がなくても、会話の流れで形になっていく。

ただ、その過程で気づいたことがありました。**このツールは、指示したことをやるのではなく、指示の外側まで考える。** そしてその思考が、チャットにそのまま残る。

何が起きているかが見える。何を判断したかが追える。それがどういう意味を持つか、検証した内容と合わせてまとめていきます。

なお、APIの活用法やデザインシステムの構築など、プロ向けの踏み込んだ使い方にご興味のある方には、この記事は物足りないかもしれません。この記事は「気になってはいるけど、まだ触ったことがない」という方に向けて書いています。

---

## 第1章：仮想商品のLPを作らせてみた

まず、何を作るかをClaudeに相談しました。「画像生成との相性も見たいから、ビジュアルが重要な商品で、構成がわかりやすいものがいい」と伝えたところ、ワイヤレスイヤホンを提案してもらい、そのままプロンプトも一緒に作りました。

```
Landing page for a wireless earphone product.
Sections: Hero (product name + tagline), 
Key features (3 points), Specs table, 
Lifestyle photos section, Customer reviews (3), 
Purchase CTA.
Tone: modern, premium, sleek.
Language: Japanese.
```

返ってきたのは、質問ではありませんでした。チャット欄にタスクリストが現れて、Claude Designは一切確認なしで動き始めたのです。

```
Progress 1/9
✅ Plan design system & scaffold HTML
□ Build Hero section
□ Build Key Features (3 points)
□ Build Specs table
...
```

しかもその直前に、こんな宣言が出ていました。

> Original brand: "SORA（空）" — a fictional premium audio brand  
> Type: Noto Serif JP + Noto Sans JP + JetBrains Mono  
> Palette: Warm off-black (#1a1614) background, warm ivory foreground

ブランド名を自分でつけて、フォントを選んで、カラーパレットまで決めている。こちらは何も指定していません。「ワイヤレスイヤホンのLP」と言っただけで、ここまで自律的に世界観を構築するとは思っていませんでした。

そして完成したLPを見て、さらに驚きました。

ヒーローのコピーは「静寂を、身につける。」。フィーチャーは「聴くことの、あたらしい基準。」。スペックは「すべての数値に、理由がある。」。レビューは「すでに、日本中で静けさが、はじまっている。」。CTAは「静けさを、手に入れる。」。

最初から最後まで、同じ世界観が一本通っていました。誰も指示していないのに。

<div class="article-diagram">
  <img src="/verification-series/claude-design/img_1.png" alt="完成したSORA LPのフルページ">
  <figcaption>完成したSORA LP — 架空のプレミアムオーディオブランド「SORA」のフルページ</figcaption>
</div>

---

## 第2章：誰も頼んでいないのに、やってくれていた

次に、画像を渡してみました。Geminiで生成したプロダクトショットとライフスタイルショットの2枚です。この画像生成用のプロンプトも、Claudeに相談して作りました。

```
A premium wireless earphone product shot. 
Matte ivory white earphone with minimal design, 
floating on dark warm background (#1a1614). 
Studio lighting, soft shadow underneath. 
No text, no logo. 
Shot from 3/4 angle showing the earphone 
and its charging case slightly open.
Photorealistic, high-end product photography style.
```

ちなみにこの背景色の指定（#1a1614）、Claude Designが最初に自律決定したブランドカラーと同じです。Claudeが決めた色を、Claudeに聞いて、Geminiに渡した。AIがAIの仕事を引き継いでいます。

Claude Designへの指示はシンプルに「この2枚を使って」とだけ伝えました。

するとチャットに、こんなログが流れ始めました。

> Based on the previews, `l6xli3...` = lifestyle (commuter), `wzgt3...` = product shot.  
> Hero slot: aspect 4/5 (portrait) — product shot needs cropping/padding  
> Lifestyle slot 1: roughly 3:2 landscape — lifestyle fits naturally

2枚のうちどちらがどのスロット用かを自分で判断して、それぞれに必要なクロップ比まで計算している。さらにこんな記述が続きました。

> The product crop is cutting off the charging case on the right. Let me redo the hero crop...  
> Same result — which means my earlier view was misleading me. This is fine — the composition works.

構図がおかしいと自分で気づいて、修正を試みて、「いや、元からそうだ、問題ない」と自己判断して進んでいる。

そしてもう一つ。Geminiの生成画像の右下に入っていた小さなウォーターマークも、自律的に除去していました。頼んでもいないのに気が利く。

ただ、ここは正直に書いておきたいのですが、**ウォーターマークの除去は商用利用においては利用規約違反、あるいはグレーな行為にあたる可能性があります。** 気が利きすぎて法律をかすめることもある、ということです。今回はあくまで検証目的で動作を確認したものであり、実務での使用には各サービスの利用規約を必ず確認してください。Claude Designが「できる」ことと、「やっていい」ことは別の話です。

<div class="article-diagram">
  <img src="/verification-series/claude-design/img_2.png" alt="画像組み込み後のヒーローセクション">
  <figcaption>画像組み込み後のヒーローセクション — プロダクトショットが自動的に配置された</figcaption>
</div>

<div class="article-diagram">
  <img src="/verification-series/claude-design/img_3.png" alt="ライフスタイルセクション（MORNING COMMUTE · TOKYO）">
  <figcaption>ライフスタイルセクション — 「MORNING COMMUTE · TOKYO」のキャプションも自律生成</figcaption>
</div>

それを踏まえた上で、この一連のログが示していることは明確です。**このツールは、指示の外側まで考える。** そしてその思考が、チャットにそのまま残る。何を判断して、何を迷って、どう結論を出したか。それが全部見える。

---

## 第3章：直すのも、会話だった

デザインが出来上がったあと、修正の方法を試してみました。Claude Designには4つのモードがあります。

- **Chat** → 構造やセクション単位の大きな変更
- **Edit** → 数値で細部を直接調整
- **Draw** → 気になる場所を囲んで指示
- **Comment** → フィードバックを残す

まずDrawを試しました。ヒーローセクションの大きすぎるテキストを、ペンで雑に囲んで「font is too large」と書いただけです（日本語入力が正常に動作しなかったため英語で入力しました）。

直りました。しかもフォントサイズが下がっただけでなく、改行位置まで整理されていました。頼んでいない部分まで直すのは、もはや癖のようです。

<div class="article-diagram">
  <img src="/verification-series/claude-design/img_4.png" alt="Drawで囲んで指示している画面">
  <figcaption>Drawモード — ペンで囲んで指示するだけで該当箇所を修正できる</figcaption>
</div>

次にCommentを試しました。テキストを選択して「他の言い回しにできる？」と入力して——「Comment」ボタンを押しました。何も起きませんでした。よく見ると「Send to Claude」というボタンが別にありました。Commentはメモとして残すだけで、「Send to Claude」で初めてClaudeが受け取る仕組みでした。コメントとは何かを問い直す体験でした。

そして「Send to Claude」を押したときの応答が面白かった。「他の言い回しに」という一言に対して、返ってきたのは修正ではなく、4つの選択肢と、それをTweaksパネルで切り替えられる仕組みでした。

> 01 · 静寂を、身につける。（original）  
> 02 · 耳元に、静けさを。  
> 03 · 音の、その先へ。  
> 04 · 日常を、澄ませる。

「直して」と言ったのに、「選んでください」と返ってきた。しかも選択肢がTweaksパネルに組み込まれていて、クリックするだけで切り替えられる。修正ではなく、**意思決定の場を作ってくれた**わけです。

このTweaksパネル、よく見るとターゲットに応じて中身が変わっていることに気づきました。シニア向けLPでは「ふりがな 表示/非表示」というオプションが日本語で並んでいて、SORA LPでは「FURIGANA OFF/ON」と英語表記になっていました。誰も設定していないのに、ターゲットを読んでUIを変えていた。

<div class="article-diagram">
  <img src="/verification-series/claude-design/img_5.png" alt="TweaksパネルでHeadlineを切り替えている画面">
  <figcaption>Tweaksパネル — コピーの選択肢がクリックで切り替えられる状態で提示された</figcaption>
</div>

---

## 第4章：作ったあとの話

デザインが出来上がったら、右上の「Export」ボタンを押してみました。出てきた選択肢がこれです。

- Download project as .zip
- Export as PDF
- Export as PPTX
- Send to Canva
- Export as standalone HTML
- Handoff to Claude Code

PDFはクライアントへの提案書に、PPTXはそのままプレゼン資料に、Canvaはノンデザイナーが編集できる状態に、HTMLはブラウザでそのまま動く形に。用途ごとに出口が用意されていました。

<div class="article-diagram">
  <img src="/verification-series/claude-design/img_6.png" alt="Exportのメニュー画面">
  <figcaption>Exportメニュー — 6種類の出力形式が用意されている</figcaption>
</div>

ダウンロードしたzipの中身を見ると、ファイル構造も綺麗に整理されていました。

```
wireless earphone/
├── assets/
│   ├── lifestyle-mute.png（最適化済み）
│   └── product-hero.png（最適化済み）
├── Landing Page.html
└── uploads/（元ファイル）
```

渡した画像は `uploads` に、Claude Designが最適化した画像は `assets` に。誰も整理するよう指示していないのに、片付けまでやってくれていました。

そして最後に「Handoff to Claude Code」を試しました。ボタンを押すと、こんなコマンドが表示されました。

```
Fetch this design file, read its readme, 
and implement the relevant aspects of the design. 
https://api.anthropic.com/v1/design/h/Dt8q2_Yqk628...
Implement: Landing Page.html
```

ローカルにファイルをダウンロードして渡すのではなく、Claude CodeがAPIのURLを直接参照しに行く仕組みです。コマンドをコピーしてターミナルで実行するだけで、Claude Codeが設計図を読みに行って実装を始めます。

<div class="article-diagram">
  <img src="/verification-series/claude-design/img_7.png" alt="Handoff to Claude Codeのモーダル画面">
  <figcaption>Handoff to Claude Code — APIのURLをClaude Codeが直接参照して実装を開始する</figcaption>
</div>

現時点ではデプロイまでの直接連携がないなど、ベータ版ならではの荒削りな部分もあります。ただそれは「まだない」というだけで、「永遠にない」という話ではないでしょう。Design → Code → Deploy が一本のパイプラインになる日は、そう遠くない気がしています。

---

## 第5章：総括——Claude Designをどう使うべきか

### このツールで起きていること

Claude Designは「指示したことをやるツール」ではありません。ブランド名・カラーパレット・コピーの世界観まで自律的に構築し、画像のクロップ比を計算し、構図の問題を自己修正し、ファイルを最適化して整理する。

それらが全てチャットログとして残ります。何を判断したか、何を迷ったか、どう結論を出したか。**過程が見えるツール**であることが、これまでのデザインツールとの最大の違いです。

### 向いている使い方

<table>
  <thead>
    <tr>
      <th>得意な場面</th>
      <th>注意が必要な場面</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ブランド・世界観からの一気通貫生成</td>
      <td>日本語入力の一部モード（Drawなど）</td>
    </tr>
    <tr>
      <td>クライアント提案用LP・モックアップ</td>
      <td>ウォーターマーク除去など利用規約グレー行為</td>
    </tr>
    <tr>
      <td>PDF・PPTX・HTMLへの多形式エクスポート</td>
      <td>デプロイまでの直接連携（現時点では未対応）</td>
    </tr>
    <tr>
      <td>Claude Codeとの連携実装</td>
      <td>research previewのため仕様変更の可能性あり</td>
    </tr>
  </tbody>
</table>

### おわりに

Claude Designを一日触って、正直に言うと「怖いくらいすごい」と思いました。

架空のブランドに名前をつけて、色を決めて、コピーの世界観を最初から最後まで通す。SORAというブランドは今日生まれて今日消えましたが、なかなか良い仕事をしていました。

でも一番驚いたのはそこじゃなくて、**その判断が全部チャットに残る**ことでした。何を考えて、何を迷って、何を選んだか。それが見えると、こちらも思考を追いかけられる。「ここの判断は違う」と介入できる。一緒に積み上げていける。

Claude Designが示しているのは、「誰もがデザイナーになれる」でも「誰もがプログラマーになれる」でもないと思っています。そうではなく、**誰もがオーケストレーターになれる**。何を作るかを決めて、判断に介入して、方向を整える人。その役割が、ツールの敷居とともに、確実に広がっていこうとしています。

まだresearch previewです。日本語の改行や、デプロイまでの直接連携がないなど、荒削りな部分もあります。でも「触ってみる価値があるか」という問いへの答えは、間違いなくYesです。

---

<div class="article-points">
  <p class="section-label">— この記事のまとめ</p>
  <ul>
    <li>Claude Designは指示していないブランド名・カラー・コピー世界観まで自律的に構築する</li>
    <li>画像の配置・クロップ・最適化・整理まで判断ログがチャットに残る</li>
    <li>Chat / Edit / Draw / Commentの4モードで段階的な修正が可能</li>
    <li>PDF・PPTX・HTML・Claude Codeなど6種類の出口が用意されている</li>
    <li>「何を判断したかが見える」ことが従来ツールとの最大の違い</li>
  </ul>
</div>

---

<p class="article-epilogue">WebデザインやAIツール活用に関するご相談は<a href="/contact" style="color:#aaa;">お問い合わせフォーム</a>または<a href="https://coconala.com/users/414106" style="color:#aaa;" target="_blank" rel="noopener">Coconala</a>よりお気軽にどうぞ。</p>
