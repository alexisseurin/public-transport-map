import React from 'react';
import './LinesDisplay.css';
import upArrow from '../assets/controls/up.svg';
import downArrow from '../assets/controls/down.svg';

interface LinesDisplayProps {
  isLineDisplayVisible: boolean;
  toggleStatsVisibility: () => void;
}

const LinesDisplay: React.FC<LinesDisplayProps> = ({ isLineDisplayVisible, toggleStatsVisibility }) => {
  return (
    <div className="bottom-stats">
        <div className="lines-section">
          <h4>Subway</h4>
          <div className="list-lines">
            <div className="list-lines__item"><div className="line line--big line-1" role="button"><span>1</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-2" role="button"><span>2</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-5" role="button"><span>5</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-6" role="button"><span>6</span></div></div>
          </div>
        </div>

      {isLineDisplayVisible && (
        <div className="lines-section">
          <h4>Tram</h4>
          <div className="list-lines">
            <div className="list-lines__item"><div className="line line--big line-3" role="button"><span>3</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-4" role="button"><span>4</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-7" role="button"><span>7</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-8" role="button"><span>8</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-9" role="button"><span>9</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-18" role="button"><span>18</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-19" role="button"><span>19</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-25" role="button"><span>25</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-39" role="button"><span>39</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-44" role="button"><span>44</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-51" role="button"><span>51</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-55" role="button"><span>55</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-62" role="button"><span>62</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-81" role="button"><span>81</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-82" role="button"><span>82</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-92" role="button"><span>92</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-93" role="button"><span>93</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-97" role="button"><span>97</span></div></div>
          </div>
          <h4>Bus</h4>
          <div className="list-lines">
            <div className="list-lines__item"><div className="line line--big line-12" role="button"><span>12</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-13" role="button"><span>13</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-14" role="button"><span>14</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-17" role="button"><span>17</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-20" role="button"><span>20</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-21" role="button"><span>21</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-27" role="button"><span>27</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-28" role="button"><span>28</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-29" role="button"><span>29</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-33" role="button"><span>33</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-34" role="button"><span>34</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-36" role="button"><span>36</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-37" role="button"><span>37</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-38" role="button"><span>38</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-41" role="button"><span>41</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-42" role="button"><span>42</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-43" role="button"><span>43</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-45" role="button"><span>45</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-46" role="button"><span>46</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-47" role="button"><span>47</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-48" role="button"><span>48</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-49" role="button"><span>49</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-50" role="button"><span>50</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-52" role="button"><span>52</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-53" role="button"><span>53</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-54" role="button"><span>54</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-56" role="button"><span>56</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-57" role="button"><span>57</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-58" role="button"><span>58</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-59" role="button"><span>59</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-60" role="button"><span>60</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-61" role="button"><span>61</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-63" role="button"><span>63</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-64" role="button"><span>64</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-65" role="button"><span>65</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-66" role="button"><span>66</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-69" role="button"><span>69</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-71" role="button"><span>71</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-72" role="button"><span>72</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-73" role="button"><span>73</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-74" role="button"><span>74</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-75" role="button"><span>75</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-76" role="button"><span>76</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-77" role="button"><span>77</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-78" role="button"><span>78</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-79" role="button"><span>79</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-80" role="button"><span>80</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-83" role="button"><span>83</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-86" role="button"><span>86</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-87" role="button"><span>87</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-88" role="button"><span>88</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-89" role="button"><span>89</span></div></div>
            <div className="list-lines__item"><div className="line line--big line-95" role="button"><span>95</span></div></div>
          </div>
        </div>
      )}
      <button className="toggle-stats-button" onClick={toggleStatsVisibility}>
          <img src={isLineDisplayVisible ? downArrow : upArrow} alt="toggle arrow" />
      </button>
    </div>
  );
}

export default LinesDisplay;
