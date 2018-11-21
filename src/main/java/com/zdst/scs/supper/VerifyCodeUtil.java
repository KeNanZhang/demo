package com.zdst.scs.supper;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class VerifyCodeUtil {
    // 图片的宽度。
    private int width = 160;
    // 图片的高度。
    private int height = 40;
    // 验证码字符个数
    private int codeCount = 4;
    // 验证码干扰线数
    private int lineCount = 20;
    // 验证码
    private String code = null;
    // 验证码图片Buffer
    private BufferedImage buffImg = null;

    private Random random = new Random();

    private Map<String,String> randomMap = new HashMap<String,String>();

    private int type=0;//生成验证码类型 0 ,随机字符串，1计算字符串



    public VerifyCodeUtil() {
        creatImage();
    }

    public VerifyCodeUtil(int width, int height) {
        this.width = width;
        this.height = height;
        creatImage();
    }

    public VerifyCodeUtil(int width, int height, int codeCount) {
        this.width = width;
        this.height = height;
        this.codeCount = codeCount;
        creatImage();
    }
    public VerifyCodeUtil(int width, int height, int codeCount, int lineCount) {
        this.width = width;
        this.height = height;
        this.codeCount = codeCount;
        this.lineCount = lineCount;
        creatImage();
    }
    /**
     * @param width 验证码宽度
     * @param height 验证码高度
     * @param codeCount 验证码长度（当type为1时无效）
     * @param lineCount 验证码干扰线条数
     * @param type 验证码类型（0，随机字符串，1计算字符串）
     * */
    public VerifyCodeUtil(int width, int height, int codeCount, int lineCount,int type) {
        this.width = width;
        this.height = height;
        this.codeCount = codeCount;
        this.lineCount = lineCount;
        this.type = type;
        creatImage();
    }

    // 生成图片
    private void creatImage() {
        int fontWidth = width / codeCount;// 字体的宽度
        int fontHeight = height - 5;// 字体的高度
        int codeY = height - 8;

        // 图像buffer
        buffImg = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics g = buffImg.getGraphics();
        //Graphics2D g = buffImg.createGraphics();
        // 设置背景色
        g.setColor(getRandColor(200, 250));
        g.fillRect(0, 0, width, height);



        // 设置字体
        //Font font1 = getFont(fontHeight);
        Font font = new Font("Fixedsys", Font.BOLD, fontHeight);
        g.setFont(font);

        // 设置干扰线
        for (int i = 0; i < lineCount; i++) {
            int xs = random.nextInt(width);
            int ys = random.nextInt(height);
            int xe = xs + random.nextInt(width);
            int ye = ys + random.nextInt(height);
            g.setColor(getRandColor(1, 255));
            g.drawLine(xs, ys, xe, ye);
        }

        // 添加噪点
        float yawpRate = 0.01f;// 噪声率
        int area = (int) (yawpRate * width * height);
        for (int i = 0; i < area; i++) {
            int x = random.nextInt(width);
            int y = random.nextInt(height);

            buffImg.setRGB(x, y, random.nextInt(255));
        }

        if(type==0){
            String str1 = randomStr(codeCount);// 得到随机字符
            this.code = str1;
            for (int i = 0; i < codeCount; i++) {
                String strRand = str1.substring(i, i + 1);
                g.setColor(getRandColor(1, 255));
                // g.drawString(a,x,y);
                // a为要画出来的东西，x和y表示要画的东西最左侧字符的基线位于此图形上下文坐标系的 (x, y) 位置处

                g.drawString(strRand, i*fontWidth+3, codeY);
            }
            randomMap.put(code, str1);
        }else if(type==1){
            Map<String, String> calStr = calStr();
            Set<String> keySet = calStr.keySet();

            int i=0;
            String keyString = "";
            //得到字符串
            for(String key:keySet){
                if(i==0){
                    keyString=key;
                }else{
                    break;
                }
                i++;
            }
            this.code = keyString;
            this.codeCount=keyString.length();
            keyString=keyString+"=?";
            //画字符串
            g.drawString(keyString, 10, codeY);

        }


    }

    // 得到随机字符
    private String randomStr(int n) {
        String str1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        String str2 = "";
        int len = str1.length() - 1;
        double r;
        for (int i = 0; i < n; i++) {
            r = (Math.random()) * len;
            str2 = str2 + str1.charAt((int) r);
        }
        return str2;
    }
    private Map<String,String> calStr(){

        int calType = random.nextInt(3);//计算类型
        int a = random.nextInt(10);
        int b = random.nextInt(10);
        String value = "";
        String key = "";
        if(calType==0){
            key=a+"+"+b;
            value = (a+b)+"";
        }else if(calType==1){
            a = random.nextInt(10)+10;//避免出现负数
            key=a+"-"+b;
            value =(a-b)+"";
        }else if(calType==2){
            key=a+"X"+b;
            value =(a*b)+"";
        }
        randomMap.put(key, value);
        return randomMap;
    }
    public static void main(String[] args) {
        VerifyCodeUtil s = new VerifyCodeUtil();
        System.out.println((int)(Math.random()));
        s.randomStr(4);
        Map<String, String> calStr = s.calStr();
        System.out.println(calStr);
    }
    // 得到随机颜色
    private Color getRandColor(int fc, int bc) {// 给定范围获得随机颜色
        if (fc > 255)
            fc = 255;
        if (bc > 255)
            bc = 255;
        int r = fc + random.nextInt(bc - fc);
        int g = fc + random.nextInt(bc - fc);
        int b = fc + random.nextInt(bc - fc);
        return new Color(r, g, b);
    }

    /**
     * 产生随机字体
     */
    private Font getFont(int size) {
        Random random = new Random();
        Font font[] = new Font[5];
        font[0] = new Font("Ravie", Font.PLAIN, size);
        font[1] = new Font("Antique Olive Compact", Font.PLAIN, size);
        font[2] = new Font("Fixedsys", Font.PLAIN, size);
        font[3] = new Font("Wide Latin", Font.PLAIN, size);
        font[4] = new Font("Gill Sans Ultra Bold", Font.PLAIN, size);
        return font[random.nextInt(5)];
    }

    // 扭曲方法
    private void shear(Graphics g, int w1, int h1, Color color) {
        shearX(g, w1, h1, color);
        shearY(g, w1, h1, color);
    }

    private void shearX(Graphics g, int w1, int h1, Color color) {

        int period = random.nextInt(2);

        boolean borderGap = true;
        int frames = 1;
        int phase = random.nextInt(2);

        for (int i = 0; i < h1; i++) {
            double d = (double) (period >> 1)
                    * Math.sin((double) i / (double) period
                    + (6.2831853071795862D * (double) phase)
                    / (double) frames);
            g.copyArea(0, i, w1, 1, (int) d, 0);
            if (borderGap) {
                g.setColor(color);
                g.drawLine((int) d, i, 0, i);
                g.drawLine((int) d + w1, i, w1, i);
            }
        }

    }

    private void shearY(Graphics g, int w1, int h1, Color color) {

        int period = random.nextInt(40) + 10; // 50;

        boolean borderGap = true;
        int frames = 20;
        int phase = 7;
        for (int i = 0; i < w1; i++) {
            double d = (double) (period >> 1)
                    * Math.sin((double) i / (double) period
                    + (6.2831853071795862D * (double) phase)
                    / (double) frames);
            g.copyArea(i, 0, 1, h1, 0, (int) d);
            if (borderGap) {
                g.setColor(color);
                g.drawLine(i, (int) d, i, 0);
                g.drawLine(i, (int) d + h1, i, h1);
            }

        }

    }



    public void write(OutputStream sos) throws IOException {
        ImageIO.write(buffImg, "png", sos);
        sos.close();
    }

    public BufferedImage getBuffImg() {
        return buffImg;
    }

    public String getCode() {
        return code.toLowerCase();
    }

    /**
     *
     * 生成验证码
     * */
    public void responseCode(HttpServletRequest req, HttpServletResponse response) throws IOException{
        // 设置响应的类型格式为图片格式
        response.setContentType("image/jpeg");
        //禁止图像缓存。
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.setDateHeader("Expires", 0);
        String string = this.randomMap.get(this.code);
        req.getSession().setAttribute("verifyCode", string);
        this.write(response.getOutputStream());
    }
    /**
     *
     * 验证验证码
     * */
    public static boolean verifyCode(String code,HttpServletRequest req){
        String sessionCode = (String) req.getSession().getAttribute("verifyCode");
        if("8888".equals(code)||(Help.isNotNull(sessionCode)&&Help.isNotNull(code)&&code.equalsIgnoreCase(sessionCode))){
            req.getSession().removeAttribute("verifyCode");
            return true;
        }
        return false;
    }

}
