import {Card} from 'antd';
import {Cryptocurrency} from '@/types/crypto.ts';
import "./CryptoCard.scss";

interface CryptoCardProps {
  crypto: Cryptocurrency
  activeCrypto: Cryptocurrency | null
  onClick: (crypto: Cryptocurrency) => void
}

function CryptoCard(props: CryptoCardProps) {
  const {
    crypto,
    activeCrypto,
    onClick
  } = props;

  return (
    <Card
      className="crypto-card"
      key={crypto.id}
      hoverable
      style={{
        width: 150,
        border: activeCrypto?.id === crypto.id ? '2px solid blue' : undefined,
        cursor: 'pointer',
      }}
      onClick={() => {
        onClick(crypto);
      }}
      cover={
        crypto.image_url ? (
          <img
            alt={crypto.name}
            src={crypto.image_url}
            style={{height: 50, objectFit: 'cover'}}
          />
        ) : null
      }
    >
      <Card.Meta title={crypto.symbol} description={crypto.name}/>
    </Card>
  )
}

export default CryptoCard;

