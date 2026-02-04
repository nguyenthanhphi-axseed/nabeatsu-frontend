export type gameData = {
  config: {
    start: number;
    end: number;
    special_num: number;
    aho_text: string;
    aho_sound_url: string;
    aho_image_url: string;
  };
  sequence: [
    {
      step: number;
      value: number;
      is_aho: boolean;
      assets: {
        text: string;
        image: string;
        sound: string;
      };
    },
  ];
};

export type gameDataRender = {
  step: number;
  value: number;
  is_aho: boolean;
  assets: {
    text: string;
    image: string;
    sound: string;
  };
};

export type ButtonProps = {
  label?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  image?: string;
};


