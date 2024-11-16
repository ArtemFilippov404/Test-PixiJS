import * as PIXI from './pixi.mjs';
import { points } from './points.js';
import { data } from './data.js';

const app = new PIXI.Application();

await app.init({
    width: 980,
    height: 630,
    backgroundColor: '#129080'
});
document.body.appendChild(app.canvas);

const container = new PIXI.Container({
    isRenderGroup: true,
});
app.stage.addChild(container);

const map = await PIXI.Assets.load('../assets/map.png');
const spriteMap = new PIXI.Sprite(map);
container.addChild(spriteMap);

const ladder = await PIXI.Assets.load('../assets/ladder.png');
const spriteLadder = new PIXI.Sprite(ladder);
spriteLadder.position.set(378, 459);
container.addChild(spriteLadder);

const path = await PIXI.Assets.load('../assets/path.png');
const spritePath = new PIXI.Sprite(path);
spritePath.position.set(78, 23);
spritePath.zIndex = 1;

container.addChild(spritePath);

const lastPoint = points[points.length - 1];
for (const point of points) {
    const spritePoint = new PIXI.Sprite(await PIXI.Assets.load(point.url));
    spritePoint.position.set(point.x, point.y);
    spritePoint.zIndex = 1;
    if (point === lastPoint) {
        spritePoint.zIndex = 0;
    }
    container.addChild(spritePoint);
}


const flower = await PIXI.Assets.load('../assets/flower.png');
const spriteFlower = new PIXI.Sprite(flower);
spriteFlower.position.set(355, 475);
container.addChild(spriteFlower);

PIXI.Assets.addBundle('fonts', [
    { alias: 'AStamperBold', src: '../assets/fonts/astamperbold.ttf' },
    { alias: 'Cambria', src: '../assets/fonts/Cambria.ttf' }
]);
await PIXI.Assets.loadBundle('fonts');

const startTextStyle = new PIXI.TextStyle({
    fontFamily: 'AStamperBold',
    fill: '#c60802',
    fontSize: 20,
    lineHeight: 18,
    fontWeight: 'bold',
    wordWrap: true,
    align: 'center',
    letterSpacing: 0.00005
});
const startText = new PIXI.Text({text: 'первый курс', style: startTextStyle});
startText.skew.set(1, -0.52);
startText.position.set(400, 538);
app.stage.addChild(startText);

const endTextStyle = new PIXI.TextStyle({
    fontFamily: 'AStamperBold',
    fill: '#036191',
    fontSize: 17,
    lineHeight: 8,
    fontWeight: 'bold',
    letterSpacing: 0.05
});
const endText = new PIXI.Text({text: 'выпускной', style: endTextStyle});
endText.skew.set(1, -0.51);
endText.position.set(860, 200);
app.stage.addChild(endText);

const girl = await PIXI.Assets.load('../assets/girl.png');
const spriteGirl = new PIXI.Sprite(girl);
spriteGirl.position.set(430, 495);
spriteGirl.anchor.set(0, 0.9);
spriteGirl.zIndex = 1;
container.addChild(spriteGirl);

const HUD = new PIXI.Container({
    isRenderGroup: true,
});
app.stage.addChild(HUD);

const buttonRating = new PIXI.Container();

const buttonRatingTexture = await PIXI.Assets.load('../assets/buttons/btnBG.png');
const buttonRatingIconTexture = await PIXI.Assets.load('../assets/buttons/ratingIcon.png');
const spriteButtonRatingBG = new PIXI.Sprite(buttonRatingTexture);
const spriteButtonRatingIcon = new PIXI.Sprite(buttonRatingIconTexture);

spriteButtonRatingIcon.anchor.set(0.5);
spriteButtonRatingIcon.position.set(spriteButtonRatingBG.width - 32.5, spriteButtonRatingBG.height - 32);

buttonRating.addChild(spriteButtonRatingBG);
buttonRating.addChild(spriteButtonRatingIcon);
buttonRating.interactive = true;
buttonRating.buttonMode = true;

buttonRating.on('pointerdown', () => {
    console.log('Rating button clicked!');
    const fromY = rating.y;
    const toY = 0;
    const duration = 400;
    const startTime = Date.now();
    const animate = () => {
        const now = Date.now();
        const timeElapsed = now - startTime;
        const progress = timeElapsed / duration;
        rating.y = fromY + (toY - fromY) * progress;
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            rating.y = toY;
            ratingWrapperBackground.visible = true;
        }
    };
    animate();
});

buttonRating.position.set(897, 551);
HUD.addChild(buttonRating);

const buttonPost = await PIXI.Assets.load('../assets/buttons/btnPost.png');
const spriteButtonPost = new PIXI.Sprite(buttonPost);
spriteButtonPost.position.set(827, 551);
HUD.addChild(spriteButtonPost);

const buttonGo = new PIXI.Container();

const buttonGoTexture = await PIXI.Assets.load('../assets/buttons/btnGO.png');
const spriteButtonGoBG = new PIXI.Sprite(buttonGoTexture);
const buttonGoTextStyle = new PIXI.TextStyle({
    fontFamily: 'Cambria',
    fill: '#ffffff',
    fontSize: 33.33,
    lineHeight: 29.45,
    textTransform: 'uppercase',
    
});
const buttonGoText = new PIXI.Text({text: 'В УНИВЕР', style: buttonGoTextStyle});
buttonGoText.anchor.set(0.5);
buttonGoText.position.set(spriteButtonGoBG.width / 2, spriteButtonGoBG.height / 2);

buttonGo.addChild(spriteButtonGoBG);
buttonGo.addChild(buttonGoText);
buttonGo.interactive = true;
buttonGo.buttonMode = true;

let pointIndex = 1;
buttonGo.on('pointerdown', () => {
    if (buttonGo.interactive) {
        const nextPoint = points[pointIndex];
        const duration = 600;
        const fromX = spriteGirl.x;
        const fromY = spriteGirl.y;
        const toX = nextPoint.x;
        const toY = nextPoint.y;
        const startTime = Date.now();
        const animate = () => {
            const now = Date.now();
            const timeElapsed = now - startTime;
            const progress = timeElapsed / duration;
            spriteGirl.x = fromX + (toX - fromX) * progress;
            spriteGirl.y = fromY + (toY - fromY) * progress;
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                spriteGirl.x = toX;
                spriteGirl.y = toY;
                pointIndex = (pointIndex + 1) % points.length;
                buttonGo.interactive = true;
            }
        };
        buttonGo.interactive = false;
        animate();
    }
});

buttonGo.position.set(616, 551);
HUD.addChild(buttonGo);

const buttonChat = new PIXI.Container();
const buttonChatTexture = await PIXI.Assets.load('../assets/buttons/btnChat.png');
const buttonChatLightTexture = await PIXI.Assets.load('../assets/buttons/btnChatLight.png');
const spriteButtonChat = new PIXI.Sprite(buttonChatTexture);
spriteButtonChat.position.set(543, 553);

buttonChat.addChild(spriteButtonChat);
buttonChat.interactive = true;
buttonChat.buttonMode = true;
buttonChat.on('pointerdown', onButtonDown).on('pointerup', onButtonUp);

function onButtonDown() {
    spriteButtonChat.texture = buttonChatLightTexture;
}
function onButtonUp() {
    spriteButtonChat.texture = buttonChatTexture;
}
HUD.addChild(buttonChat);

const friendsSlider = new PIXI.Container();

const friendsSliderTexture = await PIXI.Assets.load('../assets/friends/friendsBG.png');
const spriteFriendsSlider = new PIXI.Sprite(friendsSliderTexture);
spriteFriendsSlider.position.set(4, 551);
friendsSlider.addChild(spriteFriendsSlider);

const friendsSliderArrowLeft = await PIXI.Assets.load('../assets/friends/arrowL.png');
const spriteFriendsSliderArrowLeft = new PIXI.Sprite(friendsSliderArrowLeft);
spriteFriendsSliderArrowLeft.position.set(13, 570);
const friendsSliderArrowRight = await PIXI.Assets.load('../assets/friends/arrowR.png');
const spriteFriendsSliderArrowRight = new PIXI.Sprite(friendsSliderArrowRight);
spriteFriendsSliderArrowRight.position.set(515, 570);

friendsSlider.addChild(spriteFriendsSliderArrowLeft);
friendsSlider.addChild(spriteFriendsSliderArrowRight);


const listFriends = new PIXI.Container();
for (let i = 0; i < 8; i++) {
    const cardFriend = new PIXI.Container();
    const cardFriendTextureBG = await PIXI.Assets.load('../assets/friends/friendBG.png');
    const spriteCardFriend = new PIXI.Sprite(cardFriendTextureBG);
    cardFriend.addChild(spriteCardFriend);

    const cardFriendTextureIcon = await PIXI.Assets.load('../assets/friends/male.png');
    const spriteCardFriendIcon = new PIXI.Sprite(cardFriendTextureIcon);
    spriteCardFriendIcon.anchor.set(0.5);
    spriteCardFriendIcon.position.set(spriteCardFriend.width / 2, spriteCardFriend.height - 21);

    if (i === 0) {
        const cardFriendTexturePlus = await PIXI.Assets.load('../assets/friends/plus.png');
        const spriteCardFriendPlus = new PIXI.Sprite(cardFriendTexturePlus);
        spriteCardFriendPlus.anchor.set(0.5);
        spriteCardFriendPlus.position.set(spriteCardFriend.width - 10, 5);
        cardFriend.addChild(spriteCardFriendPlus);
        cardFriend.addChild(spriteCardFriendIcon);
    }
    
    cardFriend.position.set(34 + i * (spriteCardFriend.width + 10), 557);

    listFriends.addChild(cardFriend);
    if (i >= 8) {
        cardFriend.visible = false;
    }
}
// data.friends.forEach(async (friend, i) => {
//     const cardFriend = new PIXI.Container();
//     const cardFriendTextureBG = await PIXI.Assets.load('../assets/friends/friendBG.png');
//     const spriteCardFriend = new PIXI.Sprite(cardFriendTextureBG);

//     const cardFriendTextureIcon = await PIXI.Assets.load('../assets/friends/' + friend.img);
//     const spriteCardFriendIcon = new PIXI.Sprite(cardFriendTextureIcon);
//     spriteCardFriendIcon.anchor.set(0.5);
//     spriteCardFriendIcon.position.set(spriteCardFriend.width / 2, spriteCardFriend.height - 21);

//     if (i === 0) {
//         const cardFriendTexturePlus = await PIXI.Assets.load('../assets/friends/plus.png');
//         const spriteCardFriendPlus = new PIXI.Sprite(cardFriendTexturePlus);
//         spriteCardFriendPlus.anchor.set(0.5);
//         spriteCardFriendPlus.position.set(spriteCardFriend.width - 10, 5);
//         spriteCardFriendPlus.zIndex = 1;
//         cardFriend.addChild(spriteCardFriendPlus);
//     }

//     cardFriend.addChild(spriteCardFriend);
//     cardFriend.addChild(spriteCardFriendIcon);
//     cardFriend.position.set(34 + i * (spriteCardFriend.width + 10), 557);

//     listFriends.addChild(cardFriend);
//     if (i >= 8) {
//         cardFriend.visible = false;
//     }
// });
friendsSlider.addChild(listFriends);

function moveCardsLeft() {
    console.log('left');
}

function moveCardsRight() {
    console.log('right');
}


spriteFriendsSliderArrowLeft.interactive = true;
spriteFriendsSliderArrowLeft.buttonMode = true;
spriteFriendsSliderArrowLeft.on('pointerdown', moveCardsLeft);

spriteFriendsSliderArrowRight.interactive = true;
spriteFriendsSliderArrowRight.buttonMode = true;
spriteFriendsSliderArrowRight.on('pointerdown', moveCardsRight);
HUD.addChild(friendsSlider);

const ratingWrapper = new PIXI.Container();
ratingWrapper.zIndex = 20;
ratingWrapper.position.set(0, 0);

const ratingWrapperBackground = new PIXI.Graphics();
ratingWrapperBackground.beginFill('#000000', 0.5);
ratingWrapperBackground.drawRect(0, 0, 980, 630);
ratingWrapperBackground.endFill();
ratingWrapperBackground.interactive = true;
ratingWrapperBackground.hitArea = new PIXI.Rectangle(0, 0, 980, 630);
ratingWrapperBackground.on('pointerdown', (event) => event.stopPropagation());
ratingWrapperBackground.visible = false;
ratingWrapper.addChild(ratingWrapperBackground);

const rating = new PIXI.Container();
rating.position.set(0, -630);
ratingWrapper.addChild(rating);

const ratingTexture = await PIXI.Assets.load('../assets/rating/ratingBG.png');
const spriteRating = new PIXI.Sprite(ratingTexture);
spriteRating.position.set(242, 82);

const ratingClose = await PIXI.Assets.load('../assets/rating/ratingClose.png');
const spriteRatingClose = new PIXI.Sprite(ratingClose);
spriteRatingClose.position.set(722, 96);
spriteRatingClose.interactive = true;
spriteRatingClose.buttonMode = true;
spriteRatingClose.on('pointerdown', () => {
    console.log('Close button clicked!');
    ratingWrapperBackground.visible = false;
    // rating.position.set(0, -630);
    const fromY = rating.y;
    const toY = -630;
    const duration = 400;
    const startTime = Date.now();
    const animate = () => {
        const now = Date.now();
        const timeElapsed = now - startTime;
        const progress = timeElapsed / duration;
        rating.y = fromY + (toY - fromY) * progress;
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            rating.y = toY;
            ratingWrapperBackground.visible = false;
        }
    };
    animate();
});

const ratingTitle = await PIXI.Assets.load('../assets/rating/ratingTitle.png');
const spriteRatingTitle = new PIXI.Sprite(ratingTitle);
spriteRatingTitle.position.set(368, 71);

const ratingListBG = await PIXI.Assets.load('../assets/rating/ratingListBG.png');
const spriteRatingListBG = new PIXI.Sprite(ratingListBG);
spriteRatingListBG.position.set(271, 176);

const ratingListTitle = await PIXI.Assets.load('../assets/rating/ratingListTitle.png');
const spriteRatingListTitle = new PIXI.Sprite(ratingListTitle);
spriteRatingListTitle.position.set(302, 208);

const ratingList = new PIXI.Container();

data.rating.sort((a, b) => b.points - a.points).map(async (item, index) => {
    if (index > 7) return;
    const ratingListUser = new PIXI.Container();
    ratingListUser.position.set(302, 243 + (index * 32));
    const ratingListUserTexture = await PIXI.Assets.load('../assets/rating/ratingUserBG.png');
    const spriteRatingListUser = new PIXI.Sprite(ratingListUserTexture);

    const cardFriendTextureBG = await PIXI.Assets.load('../assets/friends/friendBG.png');
    const spriteCardFriend = new PIXI.Sprite(cardFriendTextureBG);
    spriteCardFriend.scale.set(0.5);
    spriteCardFriend.position.set(66, 0);
    const ratingListUserIcon = await PIXI.Assets.load('../assets/friends/' + item.img);
    const spriteRatingListUserIcon = new PIXI.Sprite(ratingListUserIcon);   
    spriteRatingListUserIcon.scale.set(0.5);
    spriteRatingListUserIcon.position.set(71, 5);

    const isFriend = data.friends.some(friend => friend.id === item.id);
    const RatingListUserTextStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 12,
        fill: isFriend ? '#ff0000' : '#ffffff',
        align: 'center',
    });
    const ratingListUserNumber = new PIXI.Text({text: index + 1, style: RatingListUserTextStyle});
    ratingListUserNumber.position.set(34, 6);

    const ratingListUserName = new PIXI.Text({text: item.name + ' ' + item.lastName, style: RatingListUserTextStyle});
    ratingListUserName.position.set(101, 6);

    const ratingListUserPoints = new PIXI.Text({text: item.points, style: RatingListUserTextStyle});
    ratingListUserPoints.position.set(329, 6);

    ratingListUser.addChild(spriteRatingListUser);
    ratingListUser.addChild(spriteCardFriend);
    ratingListUser.addChild(spriteRatingListUserIcon);
    ratingListUser.addChild(ratingListUserNumber);
    ratingListUser.addChild(ratingListUserName);
    ratingListUser.addChild(ratingListUserPoints);

    ratingList.addChild(ratingListUser);
    
});


rating.addChild(spriteRating);
rating.addChild(spriteRatingClose);
rating.addChild(spriteRatingTitle);
rating.addChild(spriteRatingListBG);
rating.addChild(spriteRatingListTitle);
rating.addChild(ratingList);



HUD.addChild(ratingWrapper);