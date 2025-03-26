import { jsx as _jsx } from "react/jsx-runtime";
import { Card } from 'antd';
import "./CryptoCard.scss";
function CryptoCard(props) {
    const { crypto, activeCrypto, onClick } = props;
    return (_jsx(Card, { className: "crypto-card", hoverable: true, style: {
            width: 150,
            border: activeCrypto?.id === crypto.id ? '2px solid blue' : undefined,
            cursor: 'pointer',
        }, onClick: () => {
            onClick(crypto);
        }, cover: crypto.image_url ? (_jsx("img", { alt: crypto.name, src: crypto.image_url, style: { height: 50, objectFit: 'cover' } })) : null, children: _jsx(Card.Meta, { title: crypto.symbol, description: crypto.name }) }, crypto.id));
}
export default CryptoCard;
